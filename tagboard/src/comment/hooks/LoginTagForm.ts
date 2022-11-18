import LocationInfo from "./LocationForm";
import resultOfUser from "./resultOfUser";

interface LoginInfo {
    User: resultOfUser | null;
    userID: string;
    LoginTime: string;
    LampMAC: string;
    LampSN: string;
    LampBssid: string | undefined | null;
    LastUpdateTime: string | undefined | null;
    isDayShift: boolean;
    Location: LocationInfo | null;
    photo: string | undefined;
}
export default LoginInfo;