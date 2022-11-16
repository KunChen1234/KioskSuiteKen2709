import { PrismaClient } from '@prisma/client'
import LocationInfo from '../../src/typeguards/LocationInfo';
// async function Delete() {
//     await prisma.department.deleteMany();
//     const a = await prisma.department.findMany();
//     console.log(a);
// }
async function DeleteOneLocation(BSSID: string, prisma: PrismaClient): Promise<LocationInfo[] | undefined> {
    await prisma.location.delete({
        where: {
            BSSID: BSSID
        }
    })
    const allLocation: LocationInfo[] = await prisma.location.findMany(
        {
            orderBy: {
                locationName: "asc"
            }
        }
    );
    // console.log(allLocation);
    return new Promise((resolve) => {
        resolve(allLocation);
    })
}
export default DeleteOneLocation;
// Delete()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })

