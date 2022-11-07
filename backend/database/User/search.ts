import { PrismaClient } from '@prisma/client';
import resultOfUser from '../../src/typeguards/resultOfUserFromDatabase';

const prisma = new PrismaClient()
async function SearchingBySN(number: string) {
    let user;
    try {
        user = await prisma.user.findUnique({
            where: {
                serialnumber: number,
            },
            include: {
                Area: true,
                Department: true
            }
        })
        if (user) {
            const data: resultOfUser = user;
            console.log(data.Area);
            console.log(typeof data)
        }

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