import { useEffect, useState } from 'react';
import useSocket from "../../context/socket";
import './section.css';
import Personalinfo from '../Personalinfo/personnalinfo';
import AreaInfo from '../hooks/AreaForm';
interface Prop {
    shiftTime: string;
}
function Section(prop: Prop) {
    const socket = useSocket();

    const [Area, setArea] = useState<AreaInfo[]>(() => {
        const areaInfo = sessionStorage.getItem("AreaInfo");
        if (areaInfo) {
            return JSON.parse(areaInfo)
        } else {
            return null;
        }
    });
    useEffect(() => {
        socket.emit("getAllArea");
    }, [])
    useEffect(() => {
        socket.on("UpdateAreaInfo", (msg) => {
            console.log(msg);
            setArea(msg);
            sessionStorage.setItem("AreaInfo", JSON.stringify(msg));
        })
        return function socketCleanup() {
            socket.removeAllListeners("UpdateAreaInfo");
        };
    });
    // Comment
    const a = [{
        Color: "white", Name: "maintanence",
    },
    {
        Color: "#0000ff", Name: "manager"
    }, {
        Color: "#008000", Name: "transfer"
    }, {
        Color: "#800080", Name: "section4"
    }, {
        Color: "#ffd700", Name: "section5"
    }
    ]
    if (Area) {
        return (
            <div>
                {Array.from(Area).map(entry => {
                    return (
                        <div className='pt-4'>
                            {/* border: `5px solid red`, */}
                            <div key={entry.areaName} className="board clo-flow-1 min-h-[200px] shadow-lg p-2" style={{ background: entry.areaColor }}>
                                <p className='flex bg-white w-fit'>{entry.areaName}</p>
                                <div className='pt-2'>
                                    <Personalinfo section={entry.areaName} shiftTime={prop.shiftTime}></Personalinfo>
                                </div>
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
export default Section;