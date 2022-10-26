"use strict";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents"
import { EventEmitter } from "node:events";
import { Scanmain, OpenPort } from "./scanner";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import mqtt from "./mqtt";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import { LampInfo } from "./typeguards/LampInfo";
import SearchingBySN, { Result } from "../database/search";
import { PrismaClient } from "@prisma/client";
import { DelimiterParser } from '@serialport/parser-delimiter'
import { ALL } from "dns";


async function main() {
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
				// origin: "http://localhost:3000",
				// origin: "https:*",
				methods: ["GET", "POST"],
				allowedHeaders: ["roobuck-client"],
				// credentials: true
			}
		}
	);
	let AllShift: TagBoardInfo[] = [];
	let DayShift: TagBoardInfo[] = [];
	let NightShift: TagBoardInfo[] = [];
	let newDayShift: TagBoardInfo[] = [];
	let newNightShift: TagBoardInfo[] = [];
	let loop = true;
	let getPeopleInfo = false;
	let getLampInfo = false;
	let newpeople: PeopleInfoTag = {
		ID: undefined,
		section: undefined,
		name: undefined,
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
		ChargingStatus: undefined
	}
	setInterval(() => {
		if (newDayShift.length > 0) {
			wsServer.emit("UpdateDayShift", newDayShift);
		}
		else {
			console.log("update dayshift failed")
		}
		if (newNightShift.length > 0) {
			wsServer.emit("UpdateNightShift", newNightShift);
		}
		else {
			console.log("update night shift failed")
		}

	}, 10000)
	const serialport = await OpenPort();
	let dataParser: DelimiterParser | undefined;
	if (serialport) {
		dataParser = serialport.pipe(new DelimiterParser({ delimiter: "\r", includeDelimiter: false }));
	}

	while (loop) {

		// get data from serialport
		if (serialport && dataParser) {
			const resultOfScanner = await Scanmain(wsServer, serialport, dataParser);
			if (resultOfScanner) {
				const result = JSON.parse(resultOfScanner);
				if (result.ID) {
					console.log("people")
					newpeople = {
						ID: undefined,
						section: undefined,
						name: undefined,
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
					const prisma = new PrismaClient();
					const dataFromdatabase: Result | null = await SearchingBySN(result.ID);
					try {
						await prisma.$disconnect();
						console.log("data closed")
					}
					catch (e) {
						console.error(e)
						await prisma.$disconnect()
						process.exit(1)
					}
					if (dataFromdatabase) {
						const date = new Date()
						newpeople = {
							ID: dataFromdatabase.serialnumber,
							section: dataFromdatabase.section,
							name: dataFromdatabase.name,
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
						ChargingStatus: undefined
					}
					newLamp = result;
					getLampInfo = true;
					wsServer.emit("LampInfo", result);
				}
			}
			if (getLampInfo && getPeopleInfo) {
				DayShift = [];
				NightShift = [];
				AllShift.push({ person: newpeople, lamp: newLamp });
				// AllShift.forEach(element => {
				// 	if (element.person.isDayShift) {
				// 		DayShift.push(element)
				// 	}
				// 	else {
				// 		NightShift.push(element);
				// 	}
				// });
				for (let i = 0; i < AllShift.length; i++) {
					if (AllShift[i].person.isDayShift) {
						DayShift.push(AllShift[i]);
						console.log("Dayshift length: " + DayShift.length)
					}
					else {
						NightShift.push(AllShift[i]);
						console.log("NightShift length: " + NightShift.length)
					}
				}
				wsServer.emit("NightShift", NightShift);
				wsServer.emit("DayShift", DayShift);
				getLampInfo = false;
				getPeopleInfo = false;
			}
			dataParser.removeAllListeners();
		}
		//get information from mqtt
		if (AllShift.length > 0) {
			newDayShift = [];
			newNightShift = [];
			AllShift.forEach(async element => {
				if (element.lamp.SN) {
					const resultFromMqtt = await mqtt(element.lamp.SN);
					console.log(resultFromMqtt.bssid);
					element.lamp.Bssid = resultFromMqtt.bssid;
					element.lamp.ChargingStatus = resultFromMqtt.chargingStatus;
					if (element.person.isDayShift) {
						newDayShift.push(element);
					}
					else {
						newNightShift.push(element);
					}
				}
			});
		}
	}
}

main()