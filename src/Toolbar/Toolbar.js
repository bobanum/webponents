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
			button.title = this.label || '';
			button.tabIndex = 1;
			console.log(this.icon);

			if (this.icon) {
				console.log(this.dom.icon(this.icon));

				button.appendChild(this.dom.icon(this.icon));
			} else {
				button.textContent = this.label || '';
			}
			button.addEventListener('click', (e) => {
				this.dispatchEvent(new Event('click'));
			});
			return button;
		},
		icon: (content) => {
			const result = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			rect.setAttribute('width', '100%');
			rect.setAttribute('height', '100%');
			rect.setAttribute('fill', 'yellow');
			const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `icons.svg#${content}`);
			result.setAttribute('viewBox', '0 0 24 24');
			result.appendChild(rect);
			result.appendChild(use);
			return result;
		},
		icon0: (content) => {
			const icon = document.createElement('span');
			// icon.className = 'material-icons';
			icon.textContent = content;
			return icon;
		}
	};
}
Toolbar.register();
ToolbarItem.register();


