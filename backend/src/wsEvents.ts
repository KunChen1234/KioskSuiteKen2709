"use strict";
import DepartmentInfo from "./typeguards/DepartmentInfo";
import { LampInfo } from "./typeguards/LampInfo";
import { PeopleInfoTag } from "./typeguards/PeopleInfoTag";
import { TagBoardInfo } from "./typeguards/TagBoardInfo";
import AreaInfo from "./typeguards/AreaInfo";
import LoginInfo from "./typeguards/FormOfDataFromLoginTable"
import LocationInfo from "./typeguards/LocationInfo";
interface ServerToClientEvents {
	noArg: () => void;

	tagID: (tagID: string) => void;
	PeopleID: (ID: string) => void;
	PersonalInfo: (Info: PeopleInfoTag[]) => void;
	LampInfo: (Info: LampInfo) => void;
	DayShifts: (DayShift: LoginInfo[]) => void;
	NightShift: (NightShift: LoginInfo[]) => void;
	ReadyForNext: (ready: boolean) => void;
	UpdateDayShift: (UpdateDayShift: LoginInfo[]) => void;
	UpdateNightShift: (UpdateNightShift: LoginInfo[]) => void;
	UpdateTime: (UpdateTIme: Date) => void;
	UpdateDepartmentInfo: (DepartmentInfo: DepartmentInfo[]) => void;
	UpdateAreaInfo: (AreaInfo: AreaInfo[]) => void;
	UpdateLocation: (LocationInfo: LocationInfo[]) => void;
	// section: "maintanence",
	test: (test: string) => void;
	LampAlreadyLogin: (isScanned: boolean) => void;
	PeopleAlreadyLogin: (isScanned: boolean) => void;


}
interface ClientToServerEvents {
	hello: () => void;
	connection_error: (err: unknown) => void;
	startNfcScan: () => void;
	beginTest: () => void;
	endTest: () => void;

	//Department event
	getDepartmentInfo: () => void;
	addNewDepartment: (department: DepartmentInfo) => void;
	removeDepartment: (departmentName: string) => void;
	editDepartment: (department: DepartmentInfo) => void;

	//Area event
	getAllArea: () => void;
	addNewArea: (AreaInfo: AreaInfo) => void;
	editArea: (AreaInfo: AreaInfo) => void;
	removeArea: (AreaName: string) => void;

	userInputs: (userInputs: unknown) => void;

	//Location and BSSID event
	getAllLocation: () => void;
	addNewLocation: (LocationInfo: LocationInfo) => void;
	editLocation: (LocationInfo: LocationInfo) => void;
	removeLocation: (locationName: string) => void;

	//get All Tagboard Information
	getLoginInfo: () => void;
	getDayShift: () => void;
	getNightShift: () => void;

}
interface InterServerEvents {
	ping: () => void;
}
interface SocketData {
	id: string;
	timeOfConnection: Date;
}

export { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData }