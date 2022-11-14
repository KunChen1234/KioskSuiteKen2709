"use strict";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents"
import { Scanmain, OpenPort, FindCOM } from "./scanner";
import { readTag } from "@roobuck-rnd/nfc_tools";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import { LampInfo } from "./typeguards/LampInfo";
import { PrismaClient } from "@prisma/client";
import { DelimiterParser } from '@serialport/parser-delimiter'
import DepartmentInfo from "./typeguards/DepartmentInfo";
import getIP from "./getIP";
import { exit, removeAllListeners, removeListener } from "process";
import SearchingBySN from '../database/User/search';
import AddArea from "../database/Area/AddNewArea";
import closeDatabase from "../database/closeDatabase";
import { MessageChannel } from "worker_threads";
import AddNewDepartment from "../database/Department/AddDepartment";
import getAllDepartment from "../database/Department/SearchDepartment";
import DeleteOneDepartment from "../database/Department/DeleteDepartment";
import getAllArea from "../database/Area/GetAllArea";
import { remove } from "winston";
import serverEvent from "./serverEvent/serverEvent";
import Login from "../database/LoginList/Login";
import getAllLoginInfo from "../database/LoginList/getAllLoginInfo";
import LoginInfo from "./typeguards/FormOfDataFromLoginTable";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import checkUserID from "../database/LoginList/checkUserID";
import checkLamp from "../database/LoginList/checkLamp";
import updateLampInfo from "../database/LoginList/updateLampInfo";
import Logout from "../database/LoginList/Logout";
import { addSubscribeInMqtt, connectToMqtt, mqtt } from "./mqtt";


async function main() {
	const prisma = new PrismaClient();
	let tcpPort = 8080;
	// const options = {
	//     key: readFileSync(normalize(`${__dirname}/../.certs/key.pem`)),
	//     cert: readFileSync(normalize(`${__dirname}/../.certs/server.crt`))
	// }
	function httpCB(req: IncomingMessage, res: ServerResponse) {
		// Callback for receiving an HTTP request
		// Default behaviour is to return error code 404
		console.log(`${new Date()} Received request for ${req.url}`);
		res.writeHead(404);
		res.end();
	}

	const httpServer = http.createServer(httpCB);
	httpServer.listen(tcpPort, () => {
		console.log(`Server is listening on port ${tcpPort}`);
	});
	const wsServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer,
		{
			cors: {
				// origin: nodeConfig.get("corsOrigins"),
				// origin: ["http://localhost:3000", "http://localhost:5000"],
				// origin: "https:*",
				methods: ["GET", "POST"],
				allowedHeaders: ["roobuck-client"],
				// credentials: true
			}
		}
	);

	//Comunicate between client and server
	serverEvent(wsServer, prisma);


	//Connect to Mqtt
	const mqttClient = await connectToMqtt();
	let loop = true;
	let getPeopleInfo = false;
	let getLampInfo = false;
	let newpeople: PeopleInfoTag = {
		ID: null,
		section: null,
		lastName: null,
		firstName: null,
		department: null,
		photo: null,
		job: null,
		date: undefined,
		time: undefined,
		isDayShift: undefined
	}
	let newLamp: LampInfo = {
		MAC: undefined,
		SN: undefined,
		Bssid: undefined,
		ChargingStatus: undefined,
		updateTime: undefined
	}
	// setInterval(async () => {
	// 	let updateNightShift: LoginInfo[] = [];
	// 	let updateDayShift: LoginInfo[] = [];
	// 	const resultOfallShift = await getAllLoginInfo(prisma);
	// 	closeDatabase(prisma);
	// 	if (resultOfallShift != null) {
	// 		const newAllShift: LoginInfo[] = resultOfallShift;
	// 		for (let i = 0; i < newAllShift.length; i++) {
	// 			if (newAllShift[i].isDayShift) {
	// 				updateDayShift.push(newAllShift[i]);
	// 				console.log("Dayshift length: " + updateDayShift.length)
	// 			}
	// 			else {
	// 				updateNightShift.push(newAllShift[i]);
	// 				console.log("NightShift length: " + updateNightShift.length)
	// 			}
	// 		}
	// 		wsServer.emit("UpdateNightShift", updateNightShift);
	// 		wsServer.emit("UpdateDayShift", updateDayShift);
	// 	}
	// 	// console.log("update info");
	// }, 10000)


	const serialport = await OpenPort();
	let dataParser: DelimiterParser | undefined;
	if (serialport) {
		dataParser = serialport.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
	}
	//Sever listening

	const { result } = await FindCOM();


	if (result) {
		while (loop) {

			// get data from  database
			if (serialport && dataParser) {
				const resultOfScanner = await Scanmain(wsServer, serialport, dataParser);
				if (resultOfScanner) {
					const result = JSON.parse(resultOfScanner);
					if (result.ID) {
						console.log("people")
						newpeople = {
							ID: undefined,
							section: undefined,
							lastName: undefined,
							firstName: undefined,
							department: undefined,
							photo: undefined,
							job: undefined,
							date: undefined,
							time: undefined,
							isDayShift: undefined
						}
						wsServer.emit("PeopleID", result.ID);
						/*
						*get information from database
						*/

						const dataFromdatabase = await SearchingBySN(prisma, result.ID);
						const CheckID = await checkUserID(prisma, result.ID);
						console.log("check ID: " + CheckID);
						closeDatabase(prisma);
						if (dataFromdatabase && CheckID) {
							const date = new Date()
							newpeople = {
								ID: dataFromdatabase.userID,
								section: dataFromdatabase.areaName,
								lastName: dataFromdatabase.lastName,
								firstName: dataFromdatabase.firstName,
								department: dataFromdatabase.Department,
								photo: dataFromdatabase.photo,
								job: dataFromdatabase.job,
								date: Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date),
								time: Intl.DateTimeFormat("en-UK", { hour: "2-digit", minute: "2-digit" }).format(date),
								isDayShift: undefined
							}
							if (newpeople.time) {
								if (newpeople.time >= "04:00:00" && newpeople.time <= "16:00:00") {
									console.log("dayshift")
									newpeople.isDayShift = true;
								}
								else {
									newpeople.isDayShift = false;
								}
							}
							dataParser.removeAllListeners();
							getPeopleInfo = true;
						}
						else if (!CheckID) {
							wsServer.emit("PeopleAlreadyLogin", true);
							getLampInfo = false;
							getPeopleInfo = false;
						}
						console.log(newpeople)
					}
					if (result.MAC && result.SN) {
						console.log("lamp");
						newLamp = {
							MAC: undefined,
							SN: undefined,
							Bssid: undefined,
							ChargingStatus: undefined,
							updateTime: undefined
						}
						newLamp = result;
						wsServer.emit("LampInfo", result);
						const resultOfCheckLamp = await checkLamp(prisma, result.MAC, result.SN);
						if (resultOfCheckLamp) {
							getLampInfo = true;
						}
						else {
							wsServer.emit("LampAlreadyLogin", true);
							getLampInfo = false;
							getPeopleInfo = false;
						}

					}
				}
				if (getLampInfo && getPeopleInfo) {
					if (newLamp.SN) {
						await addSubscribeInMqtt(newLamp.SN, mqttClient);
						const lampInfo = await mqtt(mqttClient, prisma);
						console.log("lampInfo MQTT: " + lampInfo);
						// newLamp.Bssid = lampInfo.bssid;
						// newLamp.ChargingStatus = lampInfo.chargingStatus;
					}
					const newShift: TagBoardInfo = ({ person: newpeople, lamp: newLamp });
					await Login(newShift, prisma);
					const resultOfallShift = await getAllLoginInfo(prisma);
					closeDatabase(prisma);
					if (resultOfallShift != null) {
						const newAllShift: LoginInfo[] = resultOfallShift;
						let newDayShift: LoginInfo[] = [];
						let newNightShift: LoginInfo[] = [];
						for (let i = 0; i < newAllShift.length; i++) {
							if (newAllShift[i].isDayShift) {
								newDayShift.push(newAllShift[i]);
								console.log("Dayshift length: " + newDayShift.length)
							}
							else {
								newNightShift.push(newAllShift[i]);
								console.log("NightShift length: " + newNightShift.length)
							}
						}
						wsServer.emit("NightShift", newNightShift);
						wsServer.emit("DayShift", newDayShift);
					}
					getLampInfo = false;
					getPeopleInfo = false;
				}
				dataParser.removeAllListeners();
			}


			//get information from mqtt

			// if (resultOfallShift != null) {

			// 	const newAllShift: LoginInfo[] = resultOfallShift;
			// 	newAllShift.forEach(async element => {
			// 		if (element.LampSN) {
			// 			const resultFromMqtt = await mqtt(element.LampSN.toString());
			// 			// console.log(resultFromMqtt.bssid);
			// 			const date = new Date()
			// 			const updateTime = Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
			// 			console.log(element.LampSN.toString() + " isCharging: " + resultFromMqtt.chargingStatus)
			// 			if (resultFromMqtt.chargingStatus === true) {
			// 				await Logout(prisma, element.userID.toString());
			// 				console.log("charging, Logout")
			// 			}
			// 			else {
			// 				if (resultFromMqtt.bssid) {
			// 					await updateLampInfo(prisma, element.userID.toString(), updateTime, resultFromMqtt.bssid);
			// 				}
			// 			}
			// 		}
			// 	});
			// 	closeDatabase(prisma);
			// 	const resultOfUpdated = await getAllLoginInfo(prisma);
			// 	closeDatabase(prisma);
			// 	if (resultOfUpdated) {
			// 		const resultOfUpdatedShift: LoginInfo[] = resultOfUpdated;
			// 		let updateNightShift: LoginInfo[] = [];
			// 		let updateDayShift: LoginInfo[] = [];
			// 		resultOfUpdatedShift.forEach(element => {
			// 			if (element.isDayShift === true) {
			// 				updateDayShift.push(element);
			// 			}
			// 			if (element.isDayShift === false) {
			// 				updateNightShift.push(element);
			// 			}
			// 		});
			// 		wsServer.emit("UpdateDayShift", updateDayShift);
			// 		wsServer.emit("UpdateNightShift", updateNightShift);
			// 	}
			// }

		}
	}
	else {
		console.log("conncet to scanner please");
		exit(1);
	}

}

main()
