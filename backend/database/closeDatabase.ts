import { PrismaClient } from "@prisma/client";

async function closeDatabase(prisma: PrismaClient) {
    try {
        await prisma.$disconnect();
        console.log("data closed")
    }
    catch (e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    }
}
export default closeDatabase;