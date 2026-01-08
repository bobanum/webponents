import Component from "../Component.js";

export default class Menu extends Component {
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	dom = {
		style: () => {
			const result = document.createDocumentFragment();
			const style = document.createElement('style');
			style.textContent = `
				:host {
					--hue: 200;
					--sat: 80%;
					background-color: hsl(var(--hue), var(--sat), 30%);
					display: flex;
				}`;
			result.appendChild(style);
			return result;
		},
		main: () => {
			const result = document.createElement('div');
			result.appendChild(document.createElement('slot'));
			return result;
		}
	};
}
class MenuItem extends Component {
	constructor() {
		super();
		this.trigger = document.createElement('a');
		this.iconElement = document.createElement('img');
		this.labelElement = document.createElement('span');
	}
	connectedCallback() {
		console.log("ici");
		
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	static properties = {
		icon: this.createProperty("icon", {
			set(value) {
				this.iconElement.src = value;
			}
		}),
		label: this.createProperty("label", {
			set(value) {
				this.labelElement.textContent = value;
			}
		}),
	};

	dom = {
		style: () => {
			const result = document.createElement('style');
			result.textContent = `
				:host {
					display: inline-flex;
				}
				a {
					display: flex;
					align-items: center;
					text-decoration: none;
					color: inherit;
				}
			`;
			return result;
		},
		main: () => {
			const result = document.createElement('div');
			result.appendChild(this.dom.trigger());
			result.appendChild(document.createElement('slot'));
			return result;
		},
		icon: () => {
			const result = this.iconElement;
			return result;
		},
		trigger: () => {
			const trigger = this.trigger;
			trigger.tabIndex = 1;
			trigger.href = '#';
			trigger.appendChild(this.dom.icon());
			trigger.appendChild(this.labelElement);
			trigger.addEventListener('click', (e) => {
				this.dispatchEvent(new Event('click'));
			});
			return trigger;
		}
	};
}
Menu.register();
MenuItem.register();


