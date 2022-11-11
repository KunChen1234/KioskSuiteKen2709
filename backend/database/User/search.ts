import { Area, Department, PrismaClient, User } from '@prisma/client';
import { resolve } from 'path';
import { resultOfUser } from '../../src/typeguards/FormOfDataFromUserDatabase';

const prisma = new PrismaClient()
async function SearchingBySN(number: string): Promise<resultOfUser | null> {
    let user: (User & { Area: Area | null; Department: Department | null; }) | null;
    try {
        user = await prisma.user.findUnique({
            where: {
                userID: number,
            },
            include: {
                Area: true,
                Department: true
            }
        })
        return new Promise((resolve) => {
            if (user) {
                const data: resultOfUser = user;
                console.log(data);
                resolve(data);
            }
            else {
                resolve(null);
            }
        })
        // if (user) {
        //     const data: resultOfUser = user;
        //     console.log(data.Area);
        //     console.log(typeof data)
        // }

    }
    catch (e) {
        console.log("can not find data");
        console.log(e);
    }
    return null;
}
export default SearchingBySN;
// SearchingBySN("0000001")
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })