import { PrismaClient } from '@prisma/client'
import AreaInfo from '../../src/typeguards/AreaInfo';
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';

async function UpdateAreaInfo(newArea: AreaInfo, prisma: PrismaClient): Promise<AreaInfo[]> {
    if (newArea.areaName) {
        await prisma.area.update({
            where: {
                areaName: newArea.areaName,
            },
            data: { areaColor: newArea.areaColor }
        })
    }
    const allArea: AreaInfo[] = await prisma.area.findMany({
        orderBy: {
            areaName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allArea);
    })
}
// CreateData()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })

export default UpdateAreaInfo;