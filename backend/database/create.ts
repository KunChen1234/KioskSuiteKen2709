import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            id:1,
            serialnumber:'C0409W-4C7525BC7020',
            section:"maintanence",
            name:'ken',
            photo:'./image/persontest.jpg',
            job:'job1'
        },
    })

}
export default main