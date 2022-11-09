import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function CreateData() {
    await prisma.user.create({
        data: {
            serialnumber: '0000001',
            firstName: 'testFirstName_1',
            lastName: 'testLastName_1',
            areaName: "test1",
            departmentName: "department1",
            job: "job1"
        },
    })
    const a = await prisma.user.findMany({
    })
    console.log( a);
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