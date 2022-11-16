import { useEffect, useState } from "react";
import useSocket from "../../../context/socket";
import LocationInfo from "../../hooks/LocationForm";
import EditPage from "../EditPage/EditPage";
import LocationEditPage from "../EditPage/LocationEditPage";

function LocationDemo() {
    const socket = useSocket();
    const [location, setLocation] = useState<LocationInfo[]>();
    const [showEditPage, setShowEditPage] = useState<boolean>(false);
    const [editBSSID, setEditBSSID] = useState<string>("");
    const [editStyle, setEditStyle] = useState<string>("");
    function remove(name: String) {
        socket.emit("removeLocation", name);
    }
    useEffect(() => {
        socket.emit("getAllLocation");
    }, [])
    useEffect(() => {
        socket.on("UpdateLocation", (msg) => {
            setLocation(msg);
        })
        return function socketCleanup() {
            socket.removeAllListeners("UpdateLocation");
        };
    });
    if (location) {
        return (

            <div>
                <LocationEditPage BSSID={editBSSID} isEditVisible={showEditPage} closeEditPage={() => setShowEditPage(false)}></LocationEditPage>
                <div className="grid grid-cols-9 gap-4 pt-4 pl-2">
                    {Array.from(location).map(entry => {
                        return (
                            <div key={entry.BSSID}>
                                <div className="col-span-1" >
                                    <div
                                        className='box-border p-2 min-w-fit max-w-sm  bg-tag-back shadow-lg grid grid-flow-3 h-fit border-4'>
                                        <div className="clo-flow-1">
                                            <p>BSSID: {entry.BSSID}</p>
                                            <p>Location Name: {entry.locationName}</p>
                                        </div>
                                        <button className="bg-roobuck-blue rounded-lg  m-1 " onClick={() => { setEditBSSID(entry.BSSID); setEditStyle("Location"); setShowEditPage(true) }}>Edit</button>
                                        <button className="bg-roobuck-blue rounded-lg  m-1 " onClick={() => { remove(entry.BSSID) }}>Remove</button>
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
export default LocationDemo;