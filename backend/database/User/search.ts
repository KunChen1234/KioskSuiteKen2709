import { PrismaClient } from '@prisma/client'

interface resultOfUser {
    serialnumber: String;
    firstName: String;
    lastName: String;
    photo: String;
    job: String;
    section: Area;
    department: Department;
}
interface Department {
    departmentName: String;
    departmentColor: String;
}
interface Area {
    AreaName: String;
    AreaColor: String;
}
const prisma = new PrismaClient()
async function SearchingBySN() {
    let user;
    try {
        user = await prisma.user.findMany({
            include: {
                Area: true,
                Department: true
            }
        })
        const data = user;
        console.log(data)
    }
    catch (e) {
        console.log("can not find data");
        console.log(e);
    }
    return null;
}
SearchingBySN()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })