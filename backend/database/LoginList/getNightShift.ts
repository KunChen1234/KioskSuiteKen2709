import { Area, Department, Location, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";

async function getNightShift(prisma: PrismaClient): Promise<resultFromLoginTable[] | null> {
    let data: (LoginInfo & {
        Location: Location | null;
        User: (User & {
            Area: Area | null;
            Department: Department | null;
        }) | null;
    })[]
    data = await prisma.loginInfo.findMany({
        where: {
            isDayShift: false
        },
        include: {
            Location: true,
            User:
            {
                include: {
                    Area: true,
                    Department: true,

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
export default getNightShift;