import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import AddArea from "../../database/Area/AddNewArea";
import deleteOneArea from "../../database/Area/DeleteArea";
import getAllArea from "../../database/Area/GetAllArea";
import UpdateAreaInfo from "../../database/Area/UpdateArea";
import closeDatabase from "../../database/closeDatabase";
import AddNewDepartment from "../../database/Department/AddDepartment";
import DeleteOneDepartment from "../../database/Department/DeleteDepartment";
import getAllDepartment from "../../database/Department/SearchDepartment";
import UpdateDepartmentInfo from "../../database/Department/UpdateDepartment";
import addNewLocation from "../../database/Location/AddLocation";
import DeleteOneLocation from "../../database/Location/DeleteLocation";
import getAllLocation from "../../database/Location/SearchLocation";
import UpdateLocation from "../../database/Location/UpdateLocation";
// import getAllLoginInfo from "../../database/LoginList/getAllLoginInfo";
import getDayShift from "../../database/LoginList/getDayShift";
import getNightShift from "../../database/LoginList/getNightShift";
import LoginInfo from "../typeguards/FormOfDataFromLoginTable";
function serverEvent(wsServer: Server, prisma: PrismaClient) {
	wsServer.on("connect", (client) => {
		console.log("connected")
		client.on("addNewArea", async (msg) => {
			console.log(msg);
			const allAreaInfo = await AddArea(msg, prisma);
			closeDatabase(prisma);
			wsServer.emit("UpdateAreaInfo", allAreaInfo);
		})
		client.on("addNewDepartment", async (msg) => {
			console.log(msg);
			const allDepartmnet = await AddNewDepartment(msg, prisma);
			closeDatabase(prisma);
			wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
		})
		client.on("getDepartmentInfo", async () => {
			console.log("client need get depart")
			const allDepartmnet = await getAllDepartment(prisma);
			closeDatabase(prisma);
			if (allDepartmnet) {
				wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
			}
		})
		client.on("removeDepartment", async (msg) => {
			console.log("remove" + msg);
			const allDepartmnet = await DeleteOneDepartment(msg, prisma);
			closeDatabase(prisma);
			if (allDepartmnet) {
				wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
			}
		})

		client.on("getAllArea", async () => {
			const allAreaInfo = await getAllArea(prisma);
			closeDatabase(prisma);
			if (allAreaInfo) {
				wsServer.emit("UpdateAreaInfo", allAreaInfo);
			}
		})

		client.on("editDepartment", async (msg) => {
			const allDepartmnet = await UpdateDepartmentInfo(msg, prisma);
			closeDatabase(prisma);
			if (allDepartmnet) {
				wsServer.emit("UpdateDepartmentInfo", allDepartmnet);
			}
		})

		client.on("editArea", async (msg) => {
			const allArea = await UpdateAreaInfo(msg, prisma);
			closeDatabase(prisma);
			if (allArea) {
				wsServer.emit("UpdateAreaInfo", allArea);
			}
		})

		client.on("removeArea", async (msg) => {
			const allArea = await deleteOneArea(msg, prisma);
			closeDatabase(prisma);
			if (allArea) {
				wsServer.emit("UpdateAreaInfo", allArea);
			}
		})

		// client.on("getLoginInfo", async () => {
		// 	let updateNightShift: LoginInfo[] = [];
		// 	let updateDayShift: LoginInfo[] = [];
		// 	const resultOfallShift = await getAllLoginInfo(prisma);
		// 	closeDatabase(prisma);
		// 	if (resultOfallShift != null) {
		// 		const newAllShift: LoginInfo[] = resultOfallShift;
		// 		for (let i = 0; i < newAllShift.length; i++) {
		// 			if (newAllShift[i].isDayShift) {
		// 				updateDayShift.push(newAllShift[i]);
		// 				console.log("Dayshift length: " + updateDayShift.length)
		// 			}
		// 			else {
		// 				updateNightShift.push(newAllShift[i]);
		// 				console.log("NightShift length: " + updateNightShift.length)
		// 			}
		// 		}
		// 		wsServer.emit("UpdateNightShift", updateNightShift);
		// 		wsServer.emit("UpdateDayShift", updateDayShift);
		// 	}
		// })

		client.on("getDayShift", async () => {
			console.log("client need day shift");
			const dayShift =await getDayShift(prisma);
			closeDatabase(prisma);
			if (dayShift != null) {
				console.log("send to day shift page")
				const resultOfDayShift = dayShift;
				console.log(resultOfDayShift);
				wsServer.emit("DayShit", resultOfDayShift);
			}
		})
		client.on("getNightShift", async () => {
			const nightShfit = await getNightShift(prisma);
			closeDatabase(prisma);
			if (nightShfit != null) {
				const resultOfNightShift = nightShfit;
				wsServer.emit("NightShifts", resultOfNightShift);
			}
		})

		client.on("getAllLocation", async () => {
			const allLocation = await getAllLocation(prisma);
			closeDatabase(prisma);
			wsServer.emit("UpdateLocation", allLocation);
		})

		client.on("addNewLocation", async (msg) => {
			console.log(msg);
			const allLocation = await addNewLocation(msg, prisma);
			wsServer.emit("UpdateLocation", allLocation);
		})
		client.on("editLocation", async (msg) => {
			const allLocation = await UpdateLocation(msg, prisma);
			closeDatabase(prisma);
			if (allLocation) {
				wsServer.emit("UpdateLocation", allLocation);
			}
		})

		client.on("removeLocation", async (msg) => {
			const allLocation = await DeleteOneLocation(msg, prisma);
			closeDatabase(prisma);
			if (allLocation) {
				wsServer.emit("UpdateLocation", allLocation);
			}
		})
	})
}
export default serverEvent;