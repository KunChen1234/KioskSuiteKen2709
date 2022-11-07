import AreaInfo from '../../src/typeguards/AreaInfo';
import DepartmentInfo from '../../src/typeguards/DepartmentInfo';
interface resultOfUser {
    serialnumber: string | null;
    firstName: string | null;
    lastName: string | null;
    photo: string | null;
    job: string | null;
    areaName: string | null;
    departmentName: string | null;
    Area: AreaInfo | null;
    Department: DepartmentInfo | null;
}
export default resultOfUser;