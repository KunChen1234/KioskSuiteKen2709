import { Area, Department, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";
/**
 * Used to when new people try to login, if this Lamp already scaned return false, elese return true.
 * 
 * */
async function checkLamp(prisma: PrismaClient, LampMAC: string, LampSN: string): Promise<boolean> {

    const data = await prisma.loginInfo.findMany({
        where: {
            LampMAC: LampMAC,
            LampSN: LampSN
        }
    });
    return new Promise((resolve) => {
        if (data.length > 0) {
            resolve(false);
            console.log(data);
        }
        else {
            resolve(true);
        }
    })
}
export default checkLamp;
