import { Visibility } from '@mui/icons-material';
import { DetailedHTMLFactory, useEffect, useState } from 'react';
import useSocket from "../../context/socket";
import miner from '../../image/miner.png';
interface Props {
    section: string;
    shiftTime: string;
}
interface DepartmentInfo {
    departmentName: string;
    departmentColor: string;
}
interface PeopleInfoTag {
    ID: string | undefined | null;
    section: string | undefined | null;
    firstName: string | undefined | null;
    lastName: string | undefined | null;
    department: DepartmentInfo | undefined | null;
    photo: string | undefined | null;
    job: string | undefined | null;
    date: string | undefined | null;
    time: string | undefined | null;
    isDayShift: boolean | undefined | null;
}
interface LampInfo {
    MAC: string | undefined | null;
    SN: string | undefined | null;
    Bssid: string | undefined | null;
    updateTime: string | undefined;
    ChargingStatus: boolean | undefined | null;
}
interface TagBoardInfo {
    person: PeopleInfoTag;
    lamp: LampInfo;
}
function Personalinfo(props: Props) {
    let detail: TagBoardInfo[] = [];
    const socket = useSocket();
    const [DayShift, setDayShift] = useState<TagBoardInfo[]>(() => {
        const user = sessionStorage.getItem("DayShift");
        if (user) {
            return JSON.parse(user)
        } else {
            return null;
        }
    });
    const [NightShift, setNightShift] = useState<TagBoardInfo[]>(() => {
        const user = sessionStorage.getItem("NightShift");
        if (user) {
            return JSON.parse(user)
        } else {
            return null;
        }
    });
    const [detailVisible, setIsDetailVisible] = useState<boolean[]>([false])
    const [photoSrc, setphotoSrc] = useState<string>();

    useEffect(() => {
        socket.on("DayShift", (msg) => {
            // console.log("dayshift get data from server");
            setDayShift(msg);
            sessionStorage.setItem("DayShift", JSON.stringify(msg));
        });
        socket.on("NightShift", (msg) => {
            setNightShift(msg);
            sessionStorage.setItem("NightShift", JSON.stringify(msg));
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
    // console.log("ID: " + IDInfo, "Lamp: " + LampInfo, "photo:" + photoSrc)

    // console.log(props.shiftTime === "NightShift")
    // console.log(NightShift)
    if (props.shiftTime === "DayShift" && DayShift) {
        // console.log("detail= dayshift")
        detail = DayShift;
    } else if (props.shiftTime === "NightShift" && NightShift) {
        // console.log("detail= nightshift")
        detail = NightShift;
    }
    // if(!detail)
    // {
    //     console.log("get data failed")
    // }    
    if (detail) {
        return (
            <div className="grid grid-cols-9 gap-5 gap-y-5">
                {Array.from(detail).map((entry, num) => {
                    //  const [isDetailVisible, setIsDetailVisible] = useState(false);
                    //  function showDetail() {
                    //      setIsDetailVisible(true);
                    //  }
                    //  function hideDetail() {
                    //      setIsDetailVisible(false);
                    //  }
                    const person = entry.person;
                    const lamp = entry.lamp;
                    let isvisible = false;
                    if (person.section === props.section && person.ID) {
                        return (
                            <div key={person.ID} className="box-border p-2 min-w-fit max-w-sm  bg-tag-back shadow-lg grid grid-flow-2 h-fit border-4"
                                style={{ borderColor: person.department?.departmentColor }}
                                onMouseEnter={() => {
                                    if (person.ID) {
                                        if (document.getElementById(person.ID)) {
                                            document.getElementById(person.ID!)!.style.display = "";
                                            console.log(document.getElementById(person.ID)?.style.visibility);
                                        }
                                    }
                                }} onMouseLeave={() => {
                                    if (person.ID) {
                                        if (document.getElementById(person.ID)) {
                                            document.getElementById(person.ID!)!.style.display = "none";
                                            console.log(document.getElementById(person.ID)?.style.visibility);
                                        }
                                    }
                                }}>
                                <div className="clo-flow-1">
                                    <img className="inline-block h-20 w-20 rounded-full ring-2 ring-black" src={require("../../image/persontest.jpg")} alt={miner}></img>
                                </div>
                                <div className="clo-flow-1">
                                    <p>ID: {person.ID}</p>
                                    <p>LastName: {person.lastName}</p>
                                    <p>FirstName: {person.firstName}</p>
                                    <p>Job: {person.job}</p>
                                    <div id={person.ID} className="" style={{ display: 'none' }}>
                                        <p>Section: {person.section}</p>
                                        <p>Time: {person.date}</p>
                                        <p>Lamp Information</p>
                                        <p>LampSN: {lamp.SN}</p>
                                        <p>LampMAC: {lamp.MAC}</p>
                                        <p>LampBssid: {lamp.Bssid}</p>
                                        <p>Update time:</p>
                                        <p>{lamp.updateTime}</p>
                                        <p>ChargingStatus: {lamp.ChargingStatus?.toString()}</p>
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