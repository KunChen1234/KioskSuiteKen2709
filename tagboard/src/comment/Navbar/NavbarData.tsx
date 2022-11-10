import { Home, LightMode, ModeNight, Settings }  from "@mui/icons-material";

interface NavbarOption {
	title: string;
	path: string;
	icon: unknown;
}
const navbarData: NavbarOption[] = [{
	title: "Home",
	path: "/",
	icon: <Home/>
}, {
	title: "Day Shift",
	path: "/day-shift",
	icon: <LightMode/>
}, {
	title: "Night Shift",
	path: "/night-shift",
	icon: <ModeNight/>
}, {
	title: "Configuration",
	path: "/configuration",
	icon: <Settings/>
}];

export default navbarData;