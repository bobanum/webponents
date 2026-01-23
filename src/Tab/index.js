import Webponent from "../Webponent.js";
import "./TabGroup.js";
import styles from "./Tab.css";
export class Tab extends Webponent {
	connectedCallback() {
		this.shadowRoot.appendChild(super.dom.style(styles));
		this.shadowRoot.appendChild(this.dom.main());
	}

	dom = {
		main: () => {
			const result = document.createElement('div');
			result.appendChild(document.createElement('slot'));
			return result;
		}
	};

	static properties = {

	};

}

Tab.register("tab");
export default Tab;