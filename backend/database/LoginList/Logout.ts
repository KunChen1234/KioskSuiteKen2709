import { PrismaClient } from "@prisma/client"

async function Logout(prisma: PrismaClient, userID: string) {
    await prisma.loginInfo.deleteMany({
        where: {
            userID: userID
        }
    });
    const a = await prisma.loginInfo.findMany();
    console.log(a);
}
export default Logout;