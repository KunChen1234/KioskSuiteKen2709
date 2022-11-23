import React, { useState } from "react";
import useSocket from "../../../context/socket";
import {AreaInfoForConfiguration} from "../../hooks/AreaForm";
import useWindowDimensions from "../../hooks/windowDimensions";
import AreaDemo from "./AreaDemo";
function AddArea() {
    const {width,height}=useWindowDimensions();
    const socket = useSocket();
    const [selectedColour, setSelectedColour] = useState("#ff0000");
    const [newAreaName, setNewAreaName] = useState<string>("");
    const demoHeight=height-100-200-50-6;
    function addNewArea(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // dispatch({ type: AreasActionKind.ADD, payload: { newAreaName: newAreaName, newAreaColour: selectedColour } });
        // console.log(`Adding Area ${newAreaName} With Colour ${selectedColour}`);
        if (newAreaName && selectedColour) {
            const newArea: AreaInfoForConfiguration = { areaName: newAreaName, areaColor: selectedColour }
            socket.emit("addNewArea", newArea);
        }
        setNewAreaName("");
    }
    return (
        <div className=" text-center">
            <div className="row-span-1 h-[100px] pt-2">
                <form onSubmit={addNewArea}>
                    <div>
                        <label>Area Name: </label>
                        <input type={"text"} className="text-black" value={newAreaName} onChange={(change) => setNewAreaName(change.target.value)}></input>
                    </div>
                    <div className="pt-2">
                        <label>Area Colour: </label>
                        <select className="bg-roobuck-onyx" value={selectedColour} onChange={(event) => setSelectedColour(event.target.value)}>
                            <option label="Red" value="#c24242">Red</option>
                            <option label="Blue" value="#29bdc1">Blue</option>
                            <option label="Purple" value="#913f92">Purple</option>
                            <option label="Green" value="#00ffab">Green</option>
                            <option label="Yellow" value="#eaff7b">Yellow</option>
                            <option label="Light Gray" value="#808080">Light Gray</option>
                            <option label="Dark Gray" value="#666666">Dark Gray</option>
                        </select>
                    </div>
                    <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" type="submit">Add New Area</button>
                </form>
            </div>
            <div className="row-span-2 pt-2" style={{ overflowY: 'auto', height: demoHeight}}>
                <AreaDemo></AreaDemo>
            </div>
        </div>
    )
}
export default AddArea;

