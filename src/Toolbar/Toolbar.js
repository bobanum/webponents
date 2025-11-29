import Component from "../Component.js";

export default class Toolbar extends Component {
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
class ToolbarItem extends Component {
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
			type: 'string',
			get() {
				return this._.icon;
			},
			set(value) {
				if (this._.icon === value) return;
				this._.icon = value;
				this.button.textContent = value;
			}
		},
	};

	dom = {
		style: () => {
			const result = document.createDocumentFragment();

			const style = document.createElement('style');
			style.textContent = `
				:host {
					display: inline-flex;
				}
				button {
					font: inherit;
					color: inherit;
					width: 100%;
					height: 100%;
						background-color: hsl(var(--hue), var(--sat), 90%);
						border: none;
						border-radius: 0.25rem;
					}
					slot {
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
			button.title = this.getAttribute('label') || '';
			button.tabIndex = 1;
			if (this.hasAttribute('icon')) {
				button.style.fontFamily = 'Material Icons';
			}
			button.textContent = this.getAttribute('icon') || this.getAttribute('label');
			button.addEventListener('click', (e) => {
				this.dispatchEvent(new Event('click'));
			});
			return button;
		}
	};
}
Toolbar.register();
ToolbarItem.register();


