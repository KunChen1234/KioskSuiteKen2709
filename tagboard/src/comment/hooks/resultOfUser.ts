import {AreaInfoForShift} from "./AreaForm";
import DepartmentInfo from "./DepartmentForm";

interface resultOfUser {
    userID: string | null;
    firstName: string | null;
    lastName: string | null;
    photo: string | null;
    job: string | null;
    areaName: string | null;
    departmentName: string | null;
    Area: AreaInfoForShift | null;
    Department: DepartmentInfo | null;
}
export default resultOfUser;
