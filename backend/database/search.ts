import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
interface Result {
    id: number,
    serialnumber: string | null,
    section: string | null,
    name: string | null,
    photo: string | null | undefined,
    job: string | null
}
async function SearchingBySN(SN: string): Promise<Result | null> {
    let user;
    try {
        user = await prisma.user.findUnique({
            where: {
                serialnumber: SN,
            },
        })
        const data: Result | null = user;
        return new Promise((resolve) => {
            resolve(data)
        })
    }
    catch (e) {
        console.log("can not find data");
        console.log(e);
    }
    return null;
}
export default SearchingBySN
export { Result }
// SearchingBySN()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })