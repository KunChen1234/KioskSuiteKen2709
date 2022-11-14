import { resultOfUser } from "./FormOfDataFromUserDatabase";
import { PeopleInfoTag } from "./PeopleInfoTag";

interface LoginInfo {
    User: resultOfUser | null;
    userID: String;
    LoginTime: String;
    LampMAC: String;
    LampSN: String;
    LampBssid: String | undefined | null;
    LastUpdateTime: String | undefined | null;
    isDayShift: boolean;
}
export default LoginInfo;