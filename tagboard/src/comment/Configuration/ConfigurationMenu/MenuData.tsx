interface MenuOption {
	title: string;
	path: string;
}
const MenuData: MenuOption[] = [{
	title: "Area",
	path: "/configuration/addarea",
}, {
	title: "Department",
	path: "/configuration/adddepartment",
},
{
	title:"Location",
	path:"/configuration/location",
}
];

export default MenuData;