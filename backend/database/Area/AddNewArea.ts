import { PrismaClient } from '@prisma/client';
import AreaInfo from '../../src/typeguards/AreaInfo';

//Add a new area and get all area info
async function AddArea(newArea: AreaInfo, prisma: PrismaClient): Promise<AreaInfo[]> {
  console.log(newArea.areaName + "database");
  console.log(newArea.areaColor + "database");
  try {
    await prisma.area.create({
      data: {
        areaName: newArea.areaName,
        areaColor: newArea.areaColor
      },
    })
  }
  catch (e) {
    console.log(e);
  }
  const a: AreaInfo[] = await prisma.area.findMany(
    {
      orderBy: {
        areaName: "asc"
      }
    }
  );
  return new Promise((resolve) => {
    resolve(a);
  })
}
export default AddArea;
// const area: AreaInfo = { areaName: "aa", areaColor: "#0000ff" }
// AddArea(area)
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })