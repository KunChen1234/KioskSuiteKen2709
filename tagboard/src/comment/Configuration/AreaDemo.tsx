import { useEffect, useState } from "react";
import useSocket from "../../context/socket";
import DepartmentInfo from "../hooks/DepartmentForm";

function ShowDemo() {
    const socket = useSocket();
    const [department, setDepartment] = useState<DepartmentInfo[]>(() => {
        const departmentInfo = sessionStorage.getItem("Area");
        if (departmentInfo) {
            return JSON.parse(departmentInfo)
        } else {
            return null;
        }
    }
    );
    function remove(name: String) {
        socket.emit("removeDepartment", name);
    }
    useEffect(() => {
        socket.emit("getDepartmentInfo");
    }, [])
    useEffect(() => {

        socket.on("UpdateDepartmentInfo", (msg) => {
            console.log(msg + "department");
            setDepartment(msg);
            sessionStorage.setItem("DepartmentInfo", JSON.stringify(msg));
        })
        return function socketCleanup() {
            socket.removeAllListeners("UpdateDepartmentInfo");
        };
    });
    if (department) {
        return (

            <div className="grid grid-cols-9 gap-4 pt-4 pl-2">

                {Array.from(department).map(entry => {
                    return (
                        <div className="col-span-1" key={entry.departmentName}>
                            <div key={entry.departmentName}
                                className='box-border p-2 min-w-fit max-w-sm  bg-tag-back shadow-lg grid grid-flow-2 h-fit border-4' style={{ borderColor: entry.departmentColor }}>
                                <div className="clo-flow-1">
                                    <img className="inline-block h-20 w-20 rounded-full ring-2 ring-black" src={require("../../image/miner.png")}></img>
                                </div>
                                <div className="clo-flow-1">
                                    <p>Deparment Name: {entry.departmentName}</p>
                                </div>
                                <button className="bg-roobuck-blue rounded-lg pr-3 m-1" onClick={() => { remove(entry.departmentName) }}>Remove</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
    else {
        return null;
    }
}
export default ShowDemo;