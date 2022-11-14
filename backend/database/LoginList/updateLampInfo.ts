import { Area, Department, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";

async function updateLampInfo(prisma: PrismaClient, userID: string, updateTime: string, bssid: string) {
    await prisma.loginInfo.updateMany({
        where: {
            userID: userID,
        },
        data: { LampBssid: bssid, LastUpdateTime: updateTime }
    })
}
export default updateLampInfo;