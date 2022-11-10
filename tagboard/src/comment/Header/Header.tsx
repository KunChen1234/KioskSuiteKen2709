import Clock from "./Clock";
import Menu from "@mui/icons-material/Menu";
interface Props {
	showHideNav: () => void;
}
function Header(prop:Props) {   
    return (
        <div className='bg-white row-span-1 h-fit'>
            <div className="bg-roobuck-blue grid grid-cols-3 gap-2 h-[100px]">
                <div className="grid grid-flow-3 text-white text-sm text-left">
                    <div className="row-span-2 text-sm pl-1">wifi</div>
                    <div>
                        <button className="pl-1 pb-1 text-left text-xl" onClick={()=>prop.showHideNav()}><Menu/></button>
                    </div>
                 
                    {/* <div className="mb-0 pr-1"></div> */}
                </div>
                <div className="text-center ">
                    <p className="text-white text-sm text-[40pt] pt-2">Roobuck</p>
                </div>
                <div className="grid grid-flow-3 text-white text-sm text-right">
                    <div className="row-span-2 text-sm pr-1">bb</div>
                    <div className="mb-0 pr-1"><Clock timer={1000} /></div>
                </div>
            </div>
        </div>
    );
}

export default Header
