import AreaInfo from './AreaInfo';
import DepartmentInfo from './DepartmentInfo';
interface resultOfUser {
    userID: string | null;
    firstName: string | null;
    lastName: string | null;
    photo: string | null;
    job: string | null;
    areaName: string | null;
    departmentName: string | null;
    Area: AreaInfo | null;
    Department: DepartmentInfo | null;
}
export { resultOfUser };