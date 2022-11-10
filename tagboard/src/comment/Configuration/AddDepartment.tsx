import React, { useState } from "react";
import useSocket from "../../context/socket";
import DepartmentInfo from "../hooks/DepartmentForm";
import DepartmentDemo from "./DepartmentDemo";
function AddDepartment() {
    const socket = useSocket();
    const [selectedColour, setSelectedColour] = useState("#ff0000");
    const [newDepartmentName, setNewDepartmentName] = useState<string>("");
    function addNewDepartment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // dispatch({ type: AreasActionKind.ADD, payload: { newAreaName: newAreaName, newAreaColour: selectedColour } });
        console.log(`Adding Area ${newDepartmentName} With Colour ${selectedColour}`);
        if (newDepartmentName && selectedColour) {
            const newDepartment: DepartmentInfo = { departmentName: newDepartmentName, departmentColor: selectedColour }
            socket.emit("addNewDepartment", newDepartment);
        }
        setNewDepartmentName("");
    }
    return (
        <div className=" text-center pt-3">
            <form onSubmit={addNewDepartment}>
                <div>
                    <label>Department Name: </label>
                    <input type={"text"} className="text-black" value={newDepartmentName} onChange={(change) => setNewDepartmentName(change.target.value)}></input>
                </div>
                <div className="pt-2">
                    <label>Department Colour: </label>
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
            <DepartmentDemo></DepartmentDemo>
        </div>
    )
}
export default AddDepartment;