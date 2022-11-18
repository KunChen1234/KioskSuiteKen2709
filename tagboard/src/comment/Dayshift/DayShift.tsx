import Section from '../Section/section';
import useWindowDimensions from '../hooks/windowDimensions';
import { useEffect, useState } from 'react';
import useSocket from '../../context/socket';
import LoginInfo from '../hooks/LoginTagForm';

function NightShift() {
    const window = useWindowDimensions();
    const socket = useSocket();
    const body_height = window.height - 100 - 35 - 100;
    const [dayShiftdetail, setdayShiftdetail] = useState<LoginInfo[]>();
    useEffect(() => {
        socket.emit("getDayShift");
        console.log("send day shift request")
        socket.on("DayShift", (msg) => {
            // console.log("dayshift get data from server");
            console.log("getDayShfit");
            setdayShiftdetail(msg);
            console.log("dayshift: "+msg);
        });
    }, [])
    useEffect(() => {
        socket.on("DayShift", (msg) => {
            // console.log("dayshift get data from server");
            console.log("getDayShfit");
            setdayShiftdetail(msg);
            console.log("dayshift: "+msg);
        });
        socket.on("UpdateDayShift", (msg) => {
            setdayShiftdetail(msg);
            console.log("updated" + msg.length)
        });
        return function socketCleanup() {
            socket.removeAllListeners("DayShift");
            socket.removeAllListeners("UpdateDayShift");
        };
    }, [dayShiftdetail])
    return (
        <div className=' bg-black text-center'>
            <p className='text-white text-[50pt] h-[100px]'>DayShift</p>
            <div className="row-span-1 bg-black  text-center gap-[2px] pb-4" style={{ overflowY: 'auto', height: body_height }}>
                <Section shiftTime='DayShift' shift={dayShiftdetail}></Section>
            </div>
        </div>);
}
export default NightShift;
