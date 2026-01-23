import Webponent from "../Webponent.js";
import { Tab } from "./index.js";
import styles from "./TabGroup.css";

export class TabGroup extends Webponent {
	connectedCallback() {
		this.parts = {};
		this.shadowRoot.appendChild(super.dom.style(styles));
		this.rendered = this.shadowRoot.appendChild(this.dom.main());
		this.active = this.active; // Trigger initial active tab setup
	}
	
	static properties = {
		active: {
			type: Number,
			default: 0,
			set: function(newValue) {
				this.parts.buttons.querySelectorAll('.tab-btn.active').forEach((btn) => btn.classList.remove('active'));
				this.parts.buttons.querySelectorAll('.tab-btn')[newValue].classList.add('active');
				const contents = [...this.children];
				contents.forEach((content) => content.classList.remove('active'));
				contents[newValue].classList.add('active');
			}
		}
	};
	dom = {
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(this.dom.buttons());
			result.appendChild(document.createElement('slot'));
			const slotAutre = document.createElement('slot');
			slotAutre.setAttribute('name', 'autre');
			result.appendChild(slotAutre);
			slotAutre.addEventListener('slotchange', (e) => {
				// Rebuild buttons on slot change
				this.parts.buttons.replaceWith(this.dom.buttons());
			});

			return result;
		},
		buttons: () => {
			const result = document.createElement('div');
			result.setAttribute('class', 'tabs');
			result.setAttribute('role', 'tablist');
			const contents = [...this.children];
			contents.forEach((tab, index) => {
				console.log(Tab);
				
				const title = TabGroup.findTitle(tab, `Tab ${index + 1}`);
				const button = this.dom.button(title);
				result.appendChild(button);
			});
			result.part = "buttons";
			this.parts.buttons = result;
			return result;
		},
		button: (label) => {
			const result = document.createElement('button');
			result.setAttribute('class', 'tab-btn');
			result.textContent = label;
			result.addEventListener('click', (e) => {
				const idx = Array.from(this.parts.buttons.children).indexOf(e.currentTarget);
				console.log(idx);
				this.active = idx;
			});
			return result;
		},
	};
	static findTitle(tabElement, defaultTitle) {
		let result = tabElement.getAttribute('label')
			|| tabElement.getAttribute('title')
			|| tabElement.querySelector('h1, h2, h3, h4, h5, h6, figcaption, legend, summary')?.textContent
			|| defaultTitle;
		return result;
	}
}

TabGroup.register("tab-group");
export default TabGroup;