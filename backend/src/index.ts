import http from "http";
import { close, createWriteStream, readFileSync, writeFileSync } from "fs";
import { normalize } from "path";
import { IncomingMessage, ServerResponse } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents"
import { DelimiterParser, SerialPort } from "serialport";
import { EventEmitter } from "node:events";
import { readTag } from "@roobuck-rnd/nfc_tools";
import Scanmain from "./scanner";
import { Client } from "socket.io/dist/client";


const internalEvents = new EventEmitter;
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
	const wsServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
		cors: {
			// origin: nodeConfig.get("corsOrigins"),
			origin: "http://localhost:3000",
			// origin: "https:*",
			methods: ["GET", "POST"],
			allowedHeaders: ["roobuck-client"],
			credentials: true
		}
	});
	wsServer.on("connect", async (client: WsClient) => {
		console.log("a user connect");
		await Scanmain(client);
	});


}

main()