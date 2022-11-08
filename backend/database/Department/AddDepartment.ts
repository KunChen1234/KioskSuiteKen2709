import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function CreateData() {
    await prisma.department.create({
        data: {
            departmentName: "department1",
            departmentcolor: "#00ffab"
        },
    })
    const a = await prisma.department.findMany({
    })
    console.log(a);
}
CreateData()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

//export default CreateData