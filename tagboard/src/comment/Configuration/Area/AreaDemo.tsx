import { useEffect, useState } from "react";
import useSocket from "../../../context/socket";
import AreaInfo from "../../hooks/AreaForm";
import EditPage from "../EditPage/EditPage";

function AreaDemo() {
    const socket = useSocket();
    const [area, setArea] = useState<AreaInfo[]>();
    const [showEditPage, setShowEditPage] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>("");
    function remove(name: String) {
        socket.emit("removeArea", name);
    }
    useEffect(() => {
        socket.emit("getAllArea");
    }, [])
    useEffect(() => {
        socket.on("UpdateAreaInfo", (msg) => {
            setArea(msg);
        })
        return function socketCleanup() {
            socket.removeAllListeners("UpdateAreaInfo");
        };
    });
    if (area) {
        return (
            <div className=" pt-2">
                <EditPage type={"Area"} name={editName} isEditVisible={showEditPage} closeEditPage={()=>setShowEditPage(false)}></EditPage>
                {Array.from(area).map(entry => {
                    return (
                        <div key={entry.areaName} className="h-[100px] pt-4" style={{ background: entry.areaColor }}>
                            <p className='flex bg-white w-fit text-black'>{entry.areaName}</p>
                            <div className="flex">
                            <button className=" bg-roobuck-blue rounded-lg  m-1 min-w-[70px] item-center"  onClick={() => { setEditName(entry.areaName); setShowEditPage(true) }}> <p className="left-1/2">Edit</p></button>
                            <button className=" bg-roobuck-blue rounded-lg  m-1 min-w-[70px] item-center" onClick={() => { remove(entry.areaName) }}> <p className="left-1/2">Remove</p></button>
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
export default AreaDemo;