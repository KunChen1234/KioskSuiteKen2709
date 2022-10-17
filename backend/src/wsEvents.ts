import {Result} from "../database/search"
import{RoobuckTag} from "./scanner"
import{SignIn} from "./scanner"
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


	tagID:(tagID:string)=>void;
	MAC:(MAC:string)=>void;
	SN:(SN:string)=>void;
	PersonalInfo:(Info:SignIn[])=>void;
	LampInfo:(Info:RoobuckTag)=>void;
	DayShift:(Info:SignIn[])=>void;
	NightShift:(Info:SignIn[])=>void;
	// section: "maintanence",

}
interface ClientToServerEvents {
	hello: () => void;
	connection_error: (err: unknown) => void;
	startNfcScan: () => void;
	beginTest: () => void;
	endTest: () => void;
	userInputs: (userInputs: unknown) => void;
	getDayShift:()=>void;
	getNightShift:()=>void;
}
interface InterServerEvents {
	ping: () => void;
}
interface SocketData {
	id: string;
	timeOfConnection: Date;
}

export {ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData}