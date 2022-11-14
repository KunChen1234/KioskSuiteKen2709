import React, { useEffect, useState } from "react";
import useSocket from "../../../context/socket";
import AreaInfo from "../../hooks/AreaForm";
import DepartmentInfo from "../../hooks/DepartmentForm";
interface Props {
    type: string;
    name: string;
    isEditVisible: boolean;
    closeEditPage: () => void;
}
function EditPage(props: Props) {
    const socket = useSocket();
    const [selectedColour, setSelectedColour] = useState("#ff0000");
    const [departmentName, setDepartmentName] = useState<string>("");

    function edit(event: React.FormEvent<HTMLFormElement>) {
        if (props.type === "Department") {
            event.preventDefault();
            setDepartmentName(props.name);
            if (departmentName && selectedColour) {
                const newDepartment: DepartmentInfo = { departmentName: departmentName, departmentColor: selectedColour }
                socket.emit("editDepartment", newDepartment);
                props.closeEditPage();
            }
        }
        if (props.type === "Area") {
            const areaName = props.name;
            console.log(areaName);
            console.log(selectedColour);
            event.preventDefault();
            if (areaName && selectedColour) {
                console.log(`Adding Area ${areaName} With Colour ${selectedColour}`);
                const Area: AreaInfo = { areaName: areaName, areaColor: selectedColour }
                socket.emit("editArea", Area);
                props.closeEditPage();
            }
        }
    }


    // 

    return (
        <div>
            <div className={`w-fit \
                h-fit \
                p-6  \
                border \
                rounded-xl \
                bg-roobuck-onyx \
                text-left \
                absolute \
                top-1/2 \
                left-1/2 \
                ranslate-x-[-50%] \
                translate-y-[-50%] \
                ${props.isEditVisible ? "visible" : "invisible"}`
            }>
                <form onSubmit={edit}>
                    <div>
                        <label>{props.type} Name: </label>
                        <p>{props.name}</p>
                    </div>
                    <div className="pt-2">
                        <label>{props.type} Colour: </label>
                        <select className="bg-roobuck-blue" value={selectedColour} onChange={(event) => setSelectedColour(event.target.value)}>
                            <option label="Red" value="#c24242">Red</option>
                            <option label="Blue" value="#29bdc1">Blue</option>
                            <option label="Purple" value="#913f92">Purple</option>
                            <option label="Green" value="#00ffab">Green</option>
                            <option label="Yellow" value="#eaff7b">Yellow</option>
                            <option label="Light Gray" value="#808080">Light Gray</option>
                            <option label="Dark Gray" value="#666666">Dark Gray</option>
                        </select>
                        <h3>Preview: </h3>
                        <div className={" m-1 p-2 rounded-xl"} style={{ background: selectedColour }}>
                        </div>
                    </div>
                    <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" type="submit">Save</button>

                </form>
                <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" onClick={() => { props.closeEditPage(); }}>Cancle</button>

            </div></div>
    )
}

export default EditPage;