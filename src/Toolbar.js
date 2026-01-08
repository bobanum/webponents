import Webponent from "./Webponent.js";

export class ToolbarItem extends Webponent {
	constructor() {
		super();
		this.button = document.createElement('button');
	}
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	static properties = {
		icon: {
			type: String,
			get() {
				return this._.icon;
			},
			set(value) {
				if (this._.icon === value) return;
				this._.icon = value;
				this.button.textContent = value;
			}
		},
		label: {
			type: String,
			get() {
				return this._.label;
			},
			set(value) {
				if (this._.label === value) return;
				this._.label = value;
				this.button.textContent = value;
			}
		},
	};

	dom = {
		style: () => {
			const result = document.createDocumentFragment();

			const style = document.createElement('style');
			style.textContent = `
				button {
					display: inline-flex;
					align-items: center;
					padding: 0.25em;
					gap: 0.25em;
					font: inherit;
					color: black;
					border: none;
					border-radius: 0.25em;
					box-shadow: inset -0.05em -0.05em 0.05em #0008,  inset 0.05em 0.05em 0.05em #fff8;
				}
				slot {
					zzzdisplay: none;
				}
				svg {
					width: var(--size);
					height: var(--size);
					fill: currentColor;
				}
				svg+span {
					display: none;
				}
			`;
			result.appendChild(style);
			return result;
		},
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.button());
			result.appendChild(document.createElement('slot'));
			return result;
		},
		button: () => {
			const button = this.button;
			button.type = 'button';
			button.id = this.id || '';
			button.title = this.label || '';
			button.tabIndex = 1;
			console.log(this.icon);

			button.appendChild(this.dom.icon());
			button.appendChild(this.dom.label());
			button.addEventListener('click', (e) => {
				this.dispatchEvent(new Event('click'));
			});
			return button;
		},
		icon: () => {
			if (!this.icon) return document.createTextNode('');
			const result = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `icons.svg#${this.icon}`);
			result.setAttribute('viewBox', '0 0 24 24');
			result.appendChild(use);
			return result;
		},
		label: () => {
			if (!this.label) return document.createTextNode('');
			const result = document.createElement('span');
			result.textContent = this.label;
			return result;
		}
	};
}
export class Toolbar extends ToolbarItem {
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
					--size: 3em;
					display: flex;
				}
				`;
			result.appendChild(style);
			return result;
		},
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(document.createElement('slot'));
			return result;
		}
	};
}
export class ToolbarZ extends Webponent {
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
				}
				::slotted(*) {
					font-size: 2rem;
					width: 1.5em;
					height: 1.5em;
				}`;
			result.appendChild(style);
			return result;
		},
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(document.createElement('slot'));
			return result;
		}
	};
}
Toolbar.register();
ToolbarItem.register();

export default Toolbar;