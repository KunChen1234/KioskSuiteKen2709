import { PrismaClient } from '@prisma/client'
import AreaInfo from '../../src/typeguards/AreaInfo';
async function getAllArea(prisma: PrismaClient): Promise<AreaInfo[] | undefined> {
    try {
        const allArea: AreaInfo[] = await prisma.area.findMany()
        console.log(allArea);
        return new Promise((resolve) => {
            resolve(allArea);
        })
    }
    catch (e) {
        console.log("can not find data from area table");
        console.log(e);
    }
}
export default getAllArea;