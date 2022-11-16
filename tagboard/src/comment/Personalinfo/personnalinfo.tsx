
import { useEffect, useState } from 'react';
import useSocket from "../../context/socket";
import miner from '../../image/miner.png';
import LocationInfo from '../hooks/LocationForm';
interface Props {
    section: string;
    shiftTime: string;
}
interface DepartmentInfo {
    departmentName: string;
    departmentColor: string;
}
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
}
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
interface AreaInfo {
    areaName?: string | null | undefined;
    areaColor?: string | null | undefined;
}
function Personalinfo(props: Props) {
    let detail: LoginInfo[] = [];
    const socket = useSocket();
    const [DayShift, setDayShift] = useState<LoginInfo[]>();
    const [NightShift, setNightShift] = useState<LoginInfo[]>();
    const [photoSrc, setphotoSrc] = useState<string>();

    useEffect(() => {
        if (props.shiftTime === "DayShift") {
            socket.emit("getDayShift");
        }
        else if (props.shiftTime === "NightShift") {
            socket.emit("getNightShift");
        }
    }, [])

    useEffect(() => {
        socket.on("DayShift", (msg) => {
            // console.log("dayshift get data from server");
            setDayShift(msg);
        });
        socket.on("NightShift", (msg) => {
            setNightShift(msg);
        });

        socket.on("UpdateDayShift", (msg) => {
            setDayShift(msg);
            console.log("updated" + msg.length)
            sessionStorage.setItem("DayShift", JSON.stringify(msg));
        });
        socket.on("UpdateNightShift", (msg) => {
            setNightShift(msg);
            console.log("uodate Nigh shift")
            sessionStorage.setItem("NightShift", JSON.stringify(msg));
        });
        return function socketCleanup() {
            socket.removeAllListeners("DayShift");
            socket.removeAllListeners("NightShift");
            socket.removeAllListeners("UpdateDayShift");
            socket.removeAllListeners("UpdateNightShift");
        };
    }, [DayShift, NightShift]);
    if (props.shiftTime === "DayShift" && DayShift) {
        detail = DayShift;
    } else if (props.shiftTime === "NightShift" && NightShift) {
        // console.log("detail= nightshift")
        detail = NightShift;
    }
    if (detail) {
        return (
            <div className="grid grid-cols-9 gap-5 gap-y-5">
                {Array.from(detail).map((entry) => {
                    //  const [isDetailVisible, setIsDetailVisible] = useState(false);
                    //  function showDetail() {
                    //      setIsDetailVisible(true);
                    //  }
                    //  function hideDetail() {
                    //      setIsDetailVisible(false);
                    //  }
                    if (entry.User?.areaName === props.section && entry.userID) {
                        return (
                            <div key={entry.userID.toString()} className="box-border p-2 min-w-fit max-w-sm  bg-tag-back shadow-lg grid grid-flow-2 h-fit border-4"
                                style={{ borderColor: entry.User.Department?.departmentColor }}
                                onMouseEnter={() => {
                                    if (entry.userID) {
                                        if (document.getElementById(entry.userID)) {
                                            document.getElementById(entry.userID)!.style.display = "";
                                            // console.log(document.getElementById(entry.userID)?.style.visibility);
                                        }
                                    }
                                }} onMouseLeave={() => {
                                    if (entry.userID) {
                                        if (document.getElementById(entry.userID)) {
                                            document.getElementById(entry.userID)!.style.display = "none";
                                            // console.log(document.getElementById(entry.userID)?.style.visibility);
                                        }
                                    }
                                }}>
                                <div className="clo-flow-1">
                                    <img className="inline-block h-20 w-20 rounded-full ring-2 ring-black" src={require("../../image/persontest.jpg")} alt={miner}></img>
                                </div>
                                <div className="clo-flow-1">
                                    <p>ID: {entry.userID}</p>
                                    <p>LastName: {entry.User.lastName}</p>
                                    <p>FirstName: {entry.User.firstName}</p>
                                    <p>Job: {entry.User.job}</p>
                                    <div id={entry.userID} style={{ display: 'none' }}>
                                        <p>Department: {entry.User.departmentName}</p>
                                        <p>Time: {entry.LoginTime}</p>
                                        <p>Lamp Information</p>
                                        <p>LampSN: {entry.LampSN}</p>
                                        <p>LampMAC: {entry.LampMAC}</p>
                                        <p>Location: {entry.Location?.locationName}</p>
                                        <p>Update time:</p>
                                        <p>{entry.LastUpdateTime}</p>
                                        {/* <p>ChargingStatus: {entry..ChargingStatus?.toString()}</p> */}
                                    </div>

                                </div>
                            </div>)
                    }
                })}
            </div >
        );
    }
    else {
        return null;
    }
}
export default Personalinfo;