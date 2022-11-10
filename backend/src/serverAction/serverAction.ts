import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";
import AddArea from "../../database/Area/AddNewArea";
import getAllArea from "../../database/Area/GetAllArea";
import closeDatabase from "../../database/closeDatabase";
import AddNewDepartment from "../../database/Department/AddDepartment";
import DeleteOneDepartment from "../../database/Department/DeleteDepartment";
import getAllDepartment from "../../database/Department/SearchDepartment";
function serverAction(wsServer:Server,prisma:PrismaClient)
{
    wsServer.on("connect", (client) => {
		console.log("connected")
		client.on("addNewArea", async (msg) => {
			console.log(msg);
			const allAreaInfo = await AddArea(msg, prisma);
			closeDatabase(prisma);
			console.log(allAreaInfo);
			wsServer.emit("UpdateAreaInfo", allAreaInfo);
		})
		client.on("addNewDepartment", async (msg) => {
			console.log(msg);
			const allDepartmnet = await AddNewDepartment(msg, prisma);
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
	})
}
export default serverAction;