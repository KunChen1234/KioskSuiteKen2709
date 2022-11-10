import Section from '../Section/section';
import useWindowDimensions from '../hooks/windowDimensions';

function NightShift() {
    const window = useWindowDimensions();
    const body_height = window.height - 100 - 35-100;
    return (
        <div className=' bg-black text-center'>
            <p className='text-white text-[50pt] h-[100px]'>DayShift</p>
            <div className="row-span-1 bg-black  text-center gap-[2px] pb-4" style={{ overflowY: 'auto', height: body_height }}>
                <Section shiftTime='DayShift'></Section>
            </div>
        </div>);
}
export default NightShift;
