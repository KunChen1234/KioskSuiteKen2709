import { PrismaClient } from '@prisma/client'
import { resolve } from 'path';
import AreaInfo from '../../src/typeguards/AreaInfo';

//Add a new area and get all area info
async function AddArea(newArea: AreaInfo, prisma:PrismaClient): Promise<AreaInfo[]> {
  console.log(newArea.areaName + "database");
  console.log(newArea.areaColor + "database");
  await prisma.area.create({
    data: {
      areaName: newArea.areaName,
      areaColor: newArea.areaColor
    },
  })
  const a: AreaInfo[] = await prisma.area.findMany();
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