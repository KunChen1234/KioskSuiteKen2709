import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function CreateData() {
    await prisma.user.create({
        data: {
            id: 2,
            serialnumber: '0000001',
            section: "maintanence",
            name: 'test1',
            photo: './image/persontest.jpg',
            job: 'job1'
        },
    })

}
async function Update() {
    const user = await prisma.user.update({
        where: {
            serialnumber: 'C0409W-4C7525BC7020',
        },
        data: {
            photo: 'persontest.jpg'
        },
    })
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