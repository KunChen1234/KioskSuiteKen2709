import React, { useEffect, useState } from "react";
import useSocket from "../../../context/socket";
import LocationInfo from "../../hooks/LocationForm";
interface Props {
    BSSID: string;
    isEditVisible: boolean;
    closeEditPage: () => void;
}
function LocationEditPage(props: Props) {
    const socket = useSocket();
    const [locationName, setLocationName] = useState<string>("");
    const [BSSID, setBSSID] = useState<string>("");

    function edit(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault();
            setBSSID(props.BSSID);
            if (BSSID && locationName) {
                const location: LocationInfo = { BSSID: BSSID, locationName: locationName }
                socket.emit("editLocation", location);
                props.closeEditPage();
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
                        <label>Location BSSID: </label>
                        <p>{props.BSSID}</p>
                    </div>
                    <div>
                        <label>Location Name: </label>
                        <input type={"text"} className="text-black" value={locationName} onChange={(change) => setLocationName(change.target.value)}></input>
                    </div>
                    <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" type="submit">Save</button>
                </form>
                <button className="bg-roobuck-blue rounded-lg pt-1 pb-1 pl-3 pr-3 m-1" onClick={() => { props.closeEditPage(); }}>Cancle</button>

            </div></div>
    )
}

export default LocationEditPage;