import Section from '../Section/section';
import useWindowDimensions from '../hooks/windowDimensions';
import { useEffect, useState } from 'react';
import useSocket from '../../context/socket';
import LoginInfo from '../hooks/LoginTagForm';


function NightShift() {
    const window = useWindowDimensions();
    const socket = useSocket();
    const body_height = window.height - 100 - 35 - 100;
    const [nightShiftdetail, setNightShiftdetail] = useState<LoginInfo[]>();
    useEffect(() => {
        socket.emit("getNightShift");
    }, [])
    useEffect(() => {
        socket.on("NightShift", (msg) => {
            setNightShiftdetail(msg);
        });
        socket.on("UpdateNightShift", (msg) => {
            setNightShiftdetail(msg);
            // console.log("uodate Nigh shift")
        });
        return function socketCleanup() {
            socket.removeAllListeners("NightShift");
            socket.removeAllListeners("UpdateNightShift");
        };
    },[nightShiftdetail])
    return (
        <div className=' bg-black text-center'>
            <p className='text-white  text-[50pt] h-[100px]'>NightShift</p>
            <div className="row-span-1 bg-black  text-center gap-[2px] pb-4" style={{ overflowY: 'auto', height: body_height }}>
                <Section shiftTime='NightShift' shift={nightShiftdetail}></Section>
            </div>
        </div>);
}
export default NightShift;
