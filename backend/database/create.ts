import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function CreateData() {
    await prisma.user.create({
        data: {
            id: 3,
            serialnumber: '0000002',
            section: "manager",
            name: 'test1',
            photo: './image/persontest.jpg',
            job: 'job1'
        },
    })

}
async function Update() {
    const user = await prisma.user.update({
        where: {
            serialnumber: '0000002',
        },
        data: {
            section: "manager"
        },
    })
}
Update()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

//export default CreateData