import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
async function Delete() {

    await prisma.loginInfo.deleteMany();
    const a = await prisma.loginInfo.findMany();
    console.log(a);

}
Delete().then(async () => {
    await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })