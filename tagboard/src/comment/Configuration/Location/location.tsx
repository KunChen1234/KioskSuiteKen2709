import React, { useState } from "react";
import useSocket from "../../../context/socket";
import LocationInfo from "../../hooks/LocationForm";
import useWindowDimensions from "../../hooks/windowDimensions";
import LocationDemo from "./locationDemo";
function AddLocation() {
    const { width, height } = useWindowDimensions();
    const socket = useSocket();
    const [newBSSID, setnewBSSID] = useState<string>("");
    const [newLocationName, setNewLocationName] = useState<string>("");
    const demoHeight = height - 100 - 200 - 50 - 6;
    function addNewArea(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // dispatch({ type: AreasActionKind.ADD, payload: { newAreaName: newAreaName, newAreaColour: selectedColour } });
        console.log(`Adding Area ${newLocationName} With Colour ${newBSSID}`);
        if (newLocationName && newBSSID) {
            const newArea: LocationInfo = { locationName: newLocationName, BSSID: newBSSID }
            socket.emit("addNewLocation", newArea);
        }
        setNewLocationName("");
    }
    return (
        <div className=" text-center">
            <div className="row-span-1 h-[100px] pt-2">
                <form onSubmit={addNewArea}>
                    <div>
                        <label>Location Name: </label>
                        <input type={"text"} className="text-black" value={newLocationName} onChange={(change) => setNewLocationName(change.target.value)}></input>
                    </div>
                    <div className="pt-2">
                        <label> BSSID: </label>
                        <input type={"text"} className="text-black" value={newBSSID} onChange={(change) => setnewBSSID(change.target.value)}></input>
                    </div>
                    <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" type="submit">Add New Area</button>
                </form>
            </div>
            <div className="row-span-2 pt-2" style={{ overflowY: 'auto', height: demoHeight }}>
                <LocationDemo></LocationDemo>
            </div>
        </div>
    )
}
export default AddLocation;

