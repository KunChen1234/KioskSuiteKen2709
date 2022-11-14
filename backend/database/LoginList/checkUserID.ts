import { Area, Department, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";
/**
 * Used to when new people try to login, if this ID card already scaned return false, if not return true.
 * 
 * */
async function checkUserID(prisma: PrismaClient, userID: string): Promise<boolean> {

    const data = await prisma.loginInfo.findMany({
        where: {
            userID: userID
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
export default checkUserID;
