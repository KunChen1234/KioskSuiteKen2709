"use strict";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents";
import { openComPort, readTag } from "@roobuck-rnd/nfc_tools";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import { LampInfo } from "./typeguards/LampInfo";
import { PrismaClient } from "@prisma/client";
import SearchingBySN from '../database/User/search';
import closeDatabase from "../database/closeDatabase";
import serverEvent from "./serverEvent/serverEvent";
import Login from "../database/LoginList/Login";
import LoginInfo from "./typeguards/FormOfDataFromLoginTable";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import checkUserID from "../database/LoginList/checkUserID";
import checkLamp from "../database/LoginList/checkLamp";
import getDayShift from "../database/LoginList/getDayShift";
import getNightShift from "../database/LoginList/getNightShift";
import parser from "./parser";


async function main() {
	const prisma = new PrismaClient();
	let tcpPort = 14000;
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
	setInterval(async () => {
		let updateNightShift: LoginInfo[] = [];
		let updateDayShift: LoginInfo[] = [];
		const date = new Date();
		// const updateTime = Intl.DateTimeFormat("en-UK", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);

		const dayShift = await getDayShift(prisma);
		const nightShfit = await getNightShift(prisma);
		closeDatabase(prisma);
		if (dayShift != null) {
			updateDayShift = dayShift;
			wsServer.emit("UpdateDayShift", dayShift);
		}
		if (nightShfit != null) {
			updateNightShift = nightShfit;
			wsServer.emit("UpdateNightShift", nightShfit);
		}
		// console.log("update info");
	}, 10000)




	// const serialport = await OpenPort();
	// let dataParser: DelimiterParser | undefined;
	// if (serialport) {
	// 	dataParser = serialport.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
	// }
	// const { result } = await FindCOM();

	const serialport = await openComPort();
	const path = serialport[0];
	const dataParser = serialport[1];
	while (loop) {
		if (dataParser) {
			const resultOfScanner = await readTag(path, dataParser);
			if (resultOfScanner) {
				const result = JSON.parse(parser(resultOfScanner));
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
						else {
							console.log("Do not have Login time!")
						}
						dataParser.removeAllListeners();
						getPeopleInfo = true;
					}
					else if (!CheckID) {
						wsServer.emit("PeopleAlreadyLogin", true);
						getLampInfo = false;
						getPeopleInfo = false;

					} else {
						console.log("Get data from database failed!");
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
					console.log(newLamp);
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
				// if (newLamp.SN) {
				// 	const resultFromMqtt = await mqtt(newLamp.SN,);
				// 	newLamp.Bssid = resultFromMqtt.bssid;
				// } else {
				// 	console.log("Can not get Lamp Serial Number");
				// }
				const newShift: TagBoardInfo = ({ person: newpeople, lamp: newLamp });
				await Login(newShift, prisma);
				const dayShift = await getDayShift(prisma);
				const nightShfit = await getNightShift(prisma);
				closeDatabase(prisma);
				if (dayShift != null) {
					wsServer.emit("DayShifts", dayShift);
				}
				if (nightShfit != null) {
					wsServer.emit("NightShift", nightShfit);
				}
				getLampInfo = false;
				getPeopleInfo = false;
			}
			dataParser.removeAllListeners();
		}


	}
}

main()
