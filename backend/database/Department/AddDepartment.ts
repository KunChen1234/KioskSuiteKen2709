import { PrismaClient } from '@prisma/client'
import { resolve } from 'path';
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';

async function AddNewDepartment(newDepartment: DepartmentInfo,prisma:PrismaClient): Promise<DepartmentInfo[]> {
    await prisma.department.create({
        data: {
            departmentName: newDepartment.departmentName,
            departmentColor: newDepartment.departmentColor
        },
    })
    const allDepartmnet: DepartmentInfo[] = await prisma.department.findMany({
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

export default AddNewDepartment;