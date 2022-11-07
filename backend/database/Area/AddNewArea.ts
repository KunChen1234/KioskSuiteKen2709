import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function AddArea() {
  await prisma.area.create({
    data: {
      areaName: "Maintanence",
      areacolor: "#29bdc1"
    },
  })
  const a = await prisma.area.findMany();
  console.log(a);
}
AddArea()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })