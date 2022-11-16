import { Area, Department, Location, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";

async function getAllLoginInfo(prisma: PrismaClient): Promise<resultFromLoginTable[] | null> {
    let data: (LoginInfo & {
        Location: Location | null;
        User: (User & {
            Area: Area | null;
            Department: Department | null;
        }) | null;
    })[]
    data = await prisma.loginInfo.findMany({
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
export default getAllLoginInfo;

// const prisma = new PrismaClient();
// async function getAllLoginInfoForTest() {

//     let data: (LoginInfo & {
//         User: (User & {
//             Area: Area | null;
//             Department: Department | null;
//         }) | null;
//     })[]
//     data = await prisma.loginInfo.findMany({
//         include: {
//             User:
//             {
//                 include: {
//                     Area: true,
//                     Department: true
//                 }
//             }
//         }
//     });
//     console.log(data);
// }
// getAllLoginInfoForTest().then(async () => {
//     await prisma.$disconnect()
// })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })