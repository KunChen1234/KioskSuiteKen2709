interface ServerToClientEvents {
	noArg: () => void;
	sendId: (clientId: string) => void;
	testError: (errorMsg: string) => void;
	testSerialNumber: (serialNumber: string) => void;
	deviceProperties: (deviceProperties: {dsrc: boolean, uwb: boolean}) => void;
	mqttResults: (mqttResults: {wifiOk: boolean, fuelOk: null | boolean, infoOk: null | boolean, dsrcMac: null | string, uwbOk: null | boolean}) => void;
	peripheralResults: (peripheralResults: {dsrcOk: boolean | null}) => void;
	testStatus: (newStatus: string) => void;
	endTest: (testResult: boolean) => void;
	aa:(name:string)=>void;
}
interface ClientToServerEvents {
	hello: () => void;
	connection_error: (err: unknown) => void;
	startNfcScan: () => void;
	beginTest: () => void;
	endTest: () => void;
	userInputs: (userInputs: unknown) => void;
}
interface InterServerEvents {
	ping: () => void;
}
interface SocketData {
	id: string;
	timeOfConnection: Date;
}

export {ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData}