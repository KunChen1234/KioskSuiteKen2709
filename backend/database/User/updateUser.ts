import { Area, Department, LoginInfo, PrismaClient, User } from "@prisma/client";
import resultFromLoginTable from "../../src/typeguards/FormOfDataFromLoginTable";

const prisma = new PrismaClient();
async function updateUser() {
    await prisma.user.updateMany({
        where: {
            userID: "0000002",
        },
        data: { photo: "miner2.jpg" }
    })
    const a = await prisma.user.findMany();
    console.log(a);
}
updateUser()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })