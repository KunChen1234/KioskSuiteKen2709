import { Style } from "@mui/icons-material";
import { useEffect, useState } from "react";
import useSocket from "../../../context/socket";
import DepartmentInfo from "../../hooks/DepartmentForm";
import useWindowDimensions from "../../hooks/windowDimensions";
import EditPage from "../EditPage/EditPage";


function DepartmentDemo() {

    const socket = useSocket();
    const [department, setDepartment] = useState<DepartmentInfo[]>();
    const [showEditPage, setShowEditPage] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>("");
    const [editStyle, setEditStyle] = useState<string>("");
    function remove(name: String) {
        socket.emit("removeDepartment", name);
    }
    function edit(name: String) {
        socket.emit("editDepartment", name);
    }
    useEffect(() => {
        socket.emit("getDepartmentInfo");
    }, [])
    useEffect(() => {
        socket.on("UpdateDepartmentInfo", (msg) => {
            console.log(msg + "department");
            setDepartment(msg);
        })
        return function socketCleanup() {
            socket.removeAllListeners("UpdateDepartmentInfo");
        };
    });
    if (department) {
        return (

            <div>
                <EditPage type={editStyle} name={editName} isEditVisible={showEditPage} closeEditPage={()=>setShowEditPage(false)}></EditPage>
                <div className="grid grid-cols-9 gap-4 pt-4 pl-2">
                    {Array.from(department).map(entry => {
                        return (
                            <div key={entry.departmentName}>
                                <div className="col-span-1" >
                                    <div 
                                        className='box-border p-2 min-w-fit max-w-sm  bg-tag-back shadow-lg grid grid-flow-3 h-fit border-4' style={{ borderColor: entry.departmentColor }}>
                                        <div className="clo-flow-1">
                                            <img className="inline-block h-20 w-20 rounded-full ring-2 ring-black" src={require("../../../image/miner.png")}></img>
                                        </div>
                                        <div className="clo-flow-1">
                                            <p>Deparment Name: {entry.departmentName}</p>
                                        </div>
                                        <button className="bg-roobuck-blue rounded-lg  m-1 " onClick={() => { setEditName(entry.departmentName); setEditStyle("Department"); setShowEditPage(true) }}>Edit</button>
                                        <button className="bg-roobuck-blue rounded-lg  m-1 " onClick={() => { remove(entry.departmentName) }}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
    else {
        return null;
    }
}
export default DepartmentDemo;