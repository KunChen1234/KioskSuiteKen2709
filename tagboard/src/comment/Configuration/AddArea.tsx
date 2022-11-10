import React, { useState } from "react";
import useSocket from "../../context/socket";
import AreaForm from "../hooks/AreaForm";
interface Props {
    isAddAreaVisible: boolean;
    close: () => void;
}
function AddArea() {
    const socket = useSocket();
    const [selectedColour, setSelectedColour] = useState("#ff0000");
    const [newAreaName, setNewAreaName] = useState<string>("");
    function addNewArea(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // dispatch({ type: AreasActionKind.ADD, payload: { newAreaName: newAreaName, newAreaColour: selectedColour } });
        console.log(`Adding Area ${newAreaName} With Colour ${selectedColour}`);
        if (newAreaName && selectedColour) {
            const newArea: AreaForm = { areaName: newAreaName, areaColor: selectedColour }
            socket.emit("addNewArea", newArea);
        }
        setNewAreaName("");
    }
    return (
        <div className="grid grid-rows-3 text-center pt-3">
            <div className="row-span-1">
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
                    <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" type="submit">Save</button>
                </form>
            </div>

        </div>
    )
}
export default AddArea;

