import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function Search() {
    let user;
    try {
        user = await prisma.department.findMany()
        console.log(user);
    }
    catch (e) {
        console.log("can not find data from department table");
        console.log(e);
    }
}
Search()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })