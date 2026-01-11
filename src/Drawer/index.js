import Webponent from "../Webponent.js";
import styles from './drawer.css';

export class Drawer extends Webponent {
	connectedCallback() {
		this.tabIndex = 1;
		this.size = this.size; // trigger setter
		this.shadowRoot.appendChild(super.dom.style(styles));
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
				console.log(value);
				
				this.style.setProperty('--drawer-size', value + 'px');
			}
		},
		side: {
			type: String,
			default: 'left',
		},
		open: {
			type: Boolean,
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
					left: 'marginLeft',
					right: 'marginRight',
					top: 'marginTop',
					bottom: 'marginBottom',
				};
				const result = document.createElement("div");
				result.classList.add("pin");
				result.part = "pin";
				result.addEventListener("click", () => {
					this.pinned = !this.pinned;
					this.parentNode.style[sides[this.side]] = this.pinned ? "250px" : "";
				});
				return result;
			},
		};
	}
}

Drawer.register('drawer');
export default Drawer;