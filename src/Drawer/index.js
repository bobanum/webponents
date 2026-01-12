import Webponent from "../Webponent.js";
import variables from './variables.css';
import styles from './drawer.css';

export class Drawer extends Webponent {
	connectedCallback() {
		this.tabIndex = 1;
		this.size = this.size; // trigger setter
		this.shadowRoot.appendChild(super.dom.style(variables + styles));
		this.rendered = this.shadowRoot.appendChild(this.dom.main());
	}
	static properties = {
		pinned: {
			type: "Boolean",
		},
		size: {
			type: Number,
			default: 250,
			set: function (value) {
				this.style.setProperty('--drawer-size', value + 'px');
			}
		},
		side: {
			type: String,
			default: 'left',
		},
	};
	get dom() {
		return {
			main: () => {
				const result = document.createElement("div");
				result.classList.add("container");
				result.appendChild(this.dom.handle());
				const main = document.createElement("main");
				main.part = "content";
				main.appendChild(this.dom.pin());
				const slot = document.createElement("slot");
				main.appendChild(slot);
				result.appendChild(main);
				return result;
			},
			handle: () => {
				const result = document.createElement("div");
				result.classList.add("handle");
				result.part = "handle";
				return result;
			},
			pin: () => {
				const sides = {
					left: 'margin-left',
					right: 'margin-right',
					top: 'margin-top',
					bottom: 'margin-bottom',
				};
				const result = document.createElement("div");
				result.classList.add("pin");
				result.part = "pin";
				result.addEventListener("click", () => {
					this.pinned = !this.pinned;
					console.log();
					
					
					if (this.pinned) {
						document.body.style.setProperty(sides[this.side], this.size + "px");
					} else {
						document.body.style.removeProperty(sides[this.side]);
					}
				});
				return result;
			},
		};
	}
}

Drawer.register('drawer');
export default Drawer;