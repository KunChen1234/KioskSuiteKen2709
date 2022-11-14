import { PrismaClient } from "@prisma/client"

async function Logout(prisma: PrismaClient, LampSN: string) {
    await prisma.loginInfo.deleteMany({
        where: {
            LampSN: LampSN
        }
    });
    const a = await prisma.loginInfo.findMany();
    console.log(a);
}
export default Logout;