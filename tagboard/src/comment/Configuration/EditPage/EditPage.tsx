import React, { useEffect, useState } from "react";
import useSocket from "../../../context/socket";
import DepartmentInfo from "../../hooks/DepartmentForm";
interface Props {
    type: string;
    name: string;
    show: boolean;
}
function EditPage(props: Props) {
    const socket = useSocket();
    const [selectedColour, setSelectedColour] = useState("#ff0000");
    const [departmentName, setDepartmentName] = useState<string>("");
    const [hide,setHide]=useState<boolean>(true);
   
    useEffect(() => {
        setHide(true); setHide(true);
    }, [])
    function edit(event: React.FormEvent<HTMLFormElement>) {
        if (props.type === "Department") {
            event.preventDefault();
            setDepartmentName(props.name);
            console.log(`Adding Area ${departmentName} With Colour ${selectedColour}`);
            if (departmentName && selectedColour) {
                const newDepartment: DepartmentInfo = { departmentName: departmentName, departmentColor: selectedColour }
                socket.emit("editDepartment", newDepartment);
            }
        }
        // if (style === "Area") {
        //     event.preventDefault();
        //     console.log(`Adding Area ${departmentName} With Colour ${selectedColour}`);
        //     if (departmentName && selectedColour) {
        //         const Area: AreaInfo = { areaName: departmentName, areaColor: selectedColour }
        //         socket.emit("editArea", Area);
        //     }
        // }
    }

    function cancle()
    {
       props.show=false;
    }
    // 
    if (props.show === true) {
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
                ${hide? "visible":"invisible"}`
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
                        </div>
                        <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" type="submit">Save</button>
                     
                    </form>
                    <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" onClick={() => { setHide(false) }}>Cancle</button>
                   
                </div></div>
        )
    }
   return null;
}

export default EditPage;