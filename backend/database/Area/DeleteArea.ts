import { PrismaClient } from '@prisma/client'
import { Interface } from 'readline';
const prisma = new PrismaClient()
async function Delete() {
    await prisma.area.deleteMany();
    const a = await prisma.area.findMany();
    console.log(a);
}
Delete()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })