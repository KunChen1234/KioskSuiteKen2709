"use strict";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents"
import { Scanmain, OpenPort, FindCOM } from "./scanner";
import { readTag } from "@roobuck-rnd/nfc_tools";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import mqtt from "./mqtt";
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
import serverAction from "./serverAction/serverAction";


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

	type WsClient = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
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
	serverAction(wsServer, prisma);
	let newAllShift: TagBoardInfo[] = [];
	let newDayShift: TagBoardInfo[] = [];
	let newNightShift: TagBoardInfo[] = [];

	let DepartmentInfo: DepartmentInfo[] = [];
	let loop = true;
	let getPeopleInfo = false;
	let getLampInfo = false;
	let newpeople: PeopleInfoTag = {
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
	let newLamp: LampInfo = {
		MAC: undefined,
		SN: undefined,
		Bssid: undefined,
		ChargingStatus: undefined,
		updateTime: undefined
	}
	setInterval(() => {
		let updateNightShift: TagBoardInfo[] = [];
		let updateDayShift: TagBoardInfo[] = [];
		if (newAllShift.length > 0) {
			newAllShift.forEach(element => {
				if (element.person.isDayShift === true) {
					updateDayShift.push(element);
				}
				if (element.person.isDayShift === false) {
					updateNightShift.push(element);
				}
			});
			// console.log("update info");
			wsServer.emit("UpdateDayShift", updateDayShift);
			wsServer.emit("UpdateNightShift", updateNightShift);
		}
	}, 10000)
	const serialport = await OpenPort();
	let dataParser: DelimiterParser | undefined;
	if (serialport) {
		dataParser = serialport.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
	}
	//Sever listening

	const { result, path } = await FindCOM();


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

						const dataFromdatabase = await SearchingBySN(result.ID);
						closeDatabase(prisma);
						if (dataFromdatabase) {
							const date = new Date()
							newpeople = {
								ID: dataFromdatabase.serialnumber,
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
						else {
							console.log("no match info");
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
						getLampInfo = true;
						wsServer.emit("LampInfo", result);
					}
				}
				if (getLampInfo && getPeopleInfo) {
					newDayShift = [];
					newNightShift = [];
					newAllShift.push({ person: newpeople, lamp: newLamp });
					// AllShift.forEach(element => {
					// 	if (element.person.isDayShift) {
					// 		DayShift.push(element)
					// 	}
					// 	else {
					// 		NightShift.push(element);
					// 	}
					// });
					for (let i = 0; i < newAllShift.length; i++) {
						if (newAllShift[i].person.isDayShift) {
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
					getLampInfo = false;
					getPeopleInfo = false;
				}
				dataParser.removeAllListeners();
			}
			//get information from mqtt
			// if (newAllShift.length > 0) {
			// 	// console.log("use mqtt");
			// 	newAllShift.forEach(async element => {
			// 		if (element.lamp.SN && (element.lamp.ChargingStatus === false || element.lamp.ChargingStatus === undefined)) {
			// 			const resultFromMqtt = await mqtt(element.lamp.SN);
			// 			// console.log(resultFromMqtt.bssid);
			// 			const date = new Date()
			// 			const updateTime = Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
			// 			element.lamp.updateTime = updateTime;
			// 			element.lamp.Bssid = resultFromMqtt.bssid;
			// 			element.lamp.ChargingStatus = resultFromMqtt.chargingStatus;
			// 		}
			// 	});
			// 	let updateBoolean: boolean = false;
			// 	for (let i = 0; i < newAllShift.length; i++) {
			// 		if (newAllShift[i].lamp.ChargingStatus === true) {
			// 			// console.log("remove")
			// 			newAllShift.splice(i, 1);
			// 			i--;
			// 			updateBoolean = true;
			// 		}
			// 	}
			// 	if (updateBoolean) {
			// 		let updateNightShift: TagBoardInfo[] = [];
			// 		let updateDayShift: TagBoardInfo[] = [];
			// 		newAllShift.forEach(element => {
			// 			if (element.person.isDayShift === true) {
			// 				updateDayShift.push(element);
			// 			}
			// 			if (element.person.isDayShift === false) {
			// 				updateNightShift.push(element);
			// 			}
			// 		});
			// 		console.log("sign out");
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
