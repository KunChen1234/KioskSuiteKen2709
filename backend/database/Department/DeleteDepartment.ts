import { PrismaClient } from '@prisma/client'
import { Interface } from 'readline';
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';
// async function Delete() {
//     await prisma.department.deleteMany();
//     const a = await prisma.department.findMany();
//     console.log(a);
// }
async function DeleteOneDepartment(name: string, prisma: PrismaClient): Promise<DepartmentInfo[] | undefined> {
    await prisma.department.delete({
        where: {
            departmentName: name
        }
    })
    const allDepartmnet: DepartmentInfo[] = await prisma.department.findMany(
        {
            orderBy: {
                departmentName: "asc"
            }
        }
    );
    // console.log(allDepartmnet);
    return new Promise((resolve) => {
        resolve(allDepartmnet);
    })
}
export default DeleteOneDepartment;
// Delete()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })

