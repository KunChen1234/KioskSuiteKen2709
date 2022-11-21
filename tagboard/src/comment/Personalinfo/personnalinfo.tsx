
import { useEffect, useState } from 'react';
import useSocket from "../../context/socket";
import DepartmentInfo from '../hooks/DepartmentForm';
import LocationInfo from '../hooks/LocationForm';
import LoginInfo from '../hooks/LoginTagForm';
interface Props {
    sfhit:LoginInfo[]|undefined;
    section:string;
}




function Personalinfo(props: Props) {
    let detail: LoginInfo[] = [];
    // const socket = useSocket();
    // const [DayShift, setDayShift] = useState<LoginInfo[]>();
    // const [NightShift, setNightShift] = useState<LoginInfo[]>();
    // const [photoSrc, setphotoSrc] = useState<string>();

    
    if (props.sfhit!=undefined) {
        detail=props.sfhit;
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
                                    <img className="inline-block h-20 w-20 rounded-full ring-2 ring-black" src={"http://localhost:9080/"+entry.User.photo} alt="no photo"></img>
                                </div>
                                <div className="clo-flow-1">
                                    <p>ID: {entry.userID}</p>
                                    <p>LastName: {entry.User.lastName}</p>
                                    <p>FirstName: {entry.User.firstName}</p>
                                    <p>Job: {entry.User.job}</p>
                                    <div id={entry.userID} style={{ display: 'none' }}>
                                        <p>Department: {entry.User.departmentName}</p>
                                        <p>Login Time: {entry.LoginTime}</p>
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