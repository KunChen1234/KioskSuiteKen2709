"use strict";
import DepartmentInfo from "./typeguards/DepartmentInfo";
import { LampInfo } from "./typeguards/LampInfo";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import AreaInfo from "./typeguards/AreaInfo";
interface ServerToClientEvents {
	noArg: () => void;
	sendId: (clientId: string) => void;
	testError: (errorMsg: string) => void;
	testSerialNumber: (serialNumber: string) => void;
	deviceProperties: (deviceProperties: { dsrc: boolean, uwb: boolean }) => void;
	mqttResults: (mqttResults: { wifiOk: boolean, fuelOk: null | boolean, infoOk: null | boolean, dsrcMac: null | string, uwbOk: null | boolean }) => void;
	peripheralResults: (peripheralResults: { dsrcOk: boolean | null }) => void;
	testStatus: (newStatus: string) => void;
	endTest: (testResult: boolean) => void;


	tagID: (tagID: string) => void;

	PeopleID: (ID: string) => void;
	PersonalInfo: (Info: PeopleInfoTag[]) => void;
	LampInfo: (Info: LampInfo) => void;
	DayShift: (DayShift: TagBoardInfo[]) => void;
	NightShift: (NightShift: TagBoardInfo[]) => void;
	ReadyForNext: (ready: boolean) => void;
	UpdateDayShift: (UpdateDayShift: TagBoardInfo[]) => void;
	UpdateNightShift: (UpdateNightShift: TagBoardInfo[]) => void;
	UpdateTime: (UpdateTIme: Date) => void;
	UpdateDepartmentInfo: (DepartmentInfo: DepartmentInfo[]) => void;
	UpdateAreaInfo: (AreaInfo: AreaInfo[]) => void;
	// section: "maintanence",
	test: (test: string) => void;

}
interface ClientToServerEvents {
	hello: () => void;
	connection_error: (err: unknown) => void;
	startNfcScan: () => void;
	beginTest: () => void;
	endTest: () => void;
	userInputs: (userInputs: unknown) => void;
	addNewDepartment: (AreaInfo: DepartmentInfo) => void;
	addNewArea: (AreaInfo: AreaInfo) => void;

}
interface InterServerEvents {
	ping: () => void;
}
interface SocketData {
	id: string;
	timeOfConnection: Date;
}

export { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData }