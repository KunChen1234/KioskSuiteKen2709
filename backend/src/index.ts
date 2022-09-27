import http from "http";
import { createWriteStream, readFileSync, writeFileSync } from "fs";
import { normalize } from "path";
import { IncomingMessage, ServerResponse } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./wsEvents"

function main() {
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
	wsServer.on("connect", (client: WsClient) => {
		client.on("beginTest", async () => {
			// logger.debug("Test Start")
			// const tagData = await startScan(nfcPort);
			console.log("beginTest")
			client.emit("aa","kun")
		});
	});

	
}
main()