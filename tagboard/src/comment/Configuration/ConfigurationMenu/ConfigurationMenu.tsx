import { Link } from "react-router-dom";
import MenuData from "./MenuData";
function ConfigurationMenu() {
	return (
		<div>
			<ul className="text-left">
				{MenuData.map((MenuData, index) => {
					return (
						<Link key={index} to={MenuData.path}>
							<li key={index} className="hover:bg-roobuck-blue p-2">
								<span>{MenuData.title}</span>
							</li>
						</Link>

					);
				})}
			</ul>
		</div>
	);
}
export default ConfigurationMenu;