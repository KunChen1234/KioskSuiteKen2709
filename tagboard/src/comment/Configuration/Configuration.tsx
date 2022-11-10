import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../Home/Home';
import useWindowDimensions from '../hooks/windowDimensions';
import AddArea from './AddArea';
import AddDepartment from './AddDepartment';
import ConfigurationMenu from './ConfigurationMenu/ConfigurationMenu';
function Configuration() {
    const window = useWindowDimensions();
    const body_height = window.height - 100 - 35 - 100;
    return (
        <div className=' bg-black text-center '>
            <p className='text-white text-[50pt] h-[100px] '>Configuration</p>
            <div className="grid grid-cols-6 row-span-1 bg-black  text-left gap-[2px] pb-4 text-white" style={{ overflowY: 'auto', height: body_height }}>
                <div className='col-span-1 border-white border-2  width-fit'><ConfigurationMenu></ConfigurationMenu></div>
                <div className='col-span-5 border-red border-2 items-center border-l-0'>
                    <Routes>
                        <Route path='/' element={<AddArea />} />
                        <Route path="/addarea" element={<AddArea />} />
                        <Route path="/adddepartment" element={<AddDepartment />} />
                    </Routes>
                </div>
            </div>
        </div>);
}
export default Configuration;
