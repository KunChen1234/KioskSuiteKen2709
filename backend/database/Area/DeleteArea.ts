import { PrismaClient } from '@prisma/client'
import AreaInfo from '../../src/typeguards/AreaInfo';

async function deleteOneArea(areaName: string, prisma: PrismaClient): Promise<AreaInfo[]> {
    await prisma.area.delete({
        where: {
            areaName: areaName
        }
    })
    const allArea: AreaInfo[] = await prisma.area.findMany({
        orderBy: {
            areaName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allArea);
    })
}
export default deleteOneArea;