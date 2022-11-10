import { Link } from "react-router-dom";
import navbarData from "./NavbarData";

interface Props {
	isVisible: boolean
}

function Navbar(props: Props) {
	return (
		<div className={`
			${props.isVisible ? "visible" : "hidden"} \
			bg-roobuck-onyx \
			text-white \
			align-left \
			text-left \
			p-4\
			h-fit
		`}>
			<ul className="text-left inline-block">
				{navbarData.map((navOption, index) => {
					return (
						<li key={index} className="hover:bg-roobuck-blue p-2">
							<Link to={navOption.path}>
								<>
									{navOption.icon}
									<span>{navOption.title}</span>
								</>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default Navbar;