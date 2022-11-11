import { PrismaClient } from '@prisma/client'
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';

async function UpdateDepartmentInfo(newDepartment: DepartmentInfo, prisma: PrismaClient): Promise<DepartmentInfo[]> {
    if (newDepartment.departmentName) {
        await prisma.department.update({
            where: {
                departmentName: newDepartment.departmentName,
            },
            data: { departmentColor: newDepartment.departmentColor }
        })
    }
    const allDepartmnet: DepartmentInfo[] = await prisma.department.findMany({
        orderBy: {
            departmentName: "asc"
        }
    })
    return new Promise((resolve) => {
        resolve(allDepartmnet);
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

export default UpdateDepartmentInfo;