import { createContext, useContext } from "react";
import io from "socket.io-client";

const socket = io("ws://localhost:8080", {
	withCredentials: true,
	extraHeaders: {
		"roobuck-client": "abcd"
	}
});

const SocketContext = createContext(socket);

export default function useSocket() {
	return useContext(SocketContext);
}