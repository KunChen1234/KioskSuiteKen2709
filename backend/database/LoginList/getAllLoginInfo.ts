import { Area, Department, LoginInfo, PrismaClient, User } from "@prisma/client";
import { resolve } from "path";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";

async function getAllLoginInfo(prisma:PrismaClient): Promise<resultFromLoginTable[] | null> {
    // let a:  include: {
    //     Area: true,
    //     Department: true
    // }
    let data: (LoginInfo & {
        User: (User & {
            Area: Area | null;
            Department: Department | null;
        }) | null;
    })[]
    data = await prisma.loginInfo.findMany({
        include: {
            User:
            {
                include: {
                    Area: true,
                    Department: true
                }
            }
        }
    });
    const result: resultFromLoginTable[] = data;
    return new Promise((resolve) => {
        if (result) {
            resolve(result)
        }
        else {
            resolve(null)
        }
    })
}
export default getAllLoginInfo;