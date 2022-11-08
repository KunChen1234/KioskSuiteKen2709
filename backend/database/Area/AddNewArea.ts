import { PrismaClient } from '@prisma/client'
import AreaInfo from '../../src/typeguards/AreaInfo';
const prisma = new PrismaClient()
async function AddArea(newArea: AreaInfo) {
  await prisma.area.create({
    data: {
      areaName: newArea.areaName,
      areacolor: newArea.areaColor
    },
  })
  const a = await prisma.area.findMany();
  console.log(a);
}
export default AddArea;
const area: AreaInfo = { areaName: "Maintanence", areaColor: "#0000ff" }
AddArea(area)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })