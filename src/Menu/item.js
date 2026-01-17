import Webponent from "../Webponent.js";
import itemCss from './item.css';

class MenuItem extends Webponent {
	constructor() {
		super();
		this.triggerElement = document.createElement('a');
		this.iconElement = document.createElement('img');
		this.labelElement = document.createElement('span');
	}
	connectedCallback() {
		this.setAttribute('tabindex', '0');
		this.shadowRoot.appendChild(super.dom.style(itemCss));
		this.shadowRoot.appendChild(this.dom.main());
	}
	static properties = {
		icon: {
			set(value) {
				if (!value) {
					this.iconElement.style.display = 'none';
					return;
				}
				this.iconElement.src = value;
			}
		},
		href: {
			set(value) {				
				this.triggerElement.href = value;
			}
		},
		label: {
			set(value) {
				if (!value) {
					this.labelElement.style.display = 'none';
					return;
				}
				this.labelElement.textContent = value;
			}
		}
	};
	get children() {
		return Array.from(this.querySelectorAll('menu-item-ponent'));
	}
	set children(value) {
		if (value.length === 0) return;
		const childMenu = document.createElement('menu-ponent');
		childMenu.appendChild(childMenu.json2ponent(value));
		this.appendChild(childMenu);
	}

	dom = {
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.trigger());
			result.appendChild(document.createElement('slot'));
			return result;
		},
		icon: () => {
			const result = this.iconElement;
			return result;
		},
		trigger: () => {
			const result = this.triggerElement;
			result.tabIndex = 0;			
			result.appendChild(this.dom.icon());
			result.appendChild(this.labelElement);
			result.addEventListener('click', (e) => {
				this.dispatchEvent(new Event('click'));
			});
			return result;
		}
	};
}
MenuItem.register('menu-item');
export default MenuItem;

