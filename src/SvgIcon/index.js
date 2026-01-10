import Webponent from "../Webponent.js";

export default class SvgIcon extends Webponent {
	static _href;
	constructor() {
		super();
		this.use = this.dom.use();
	}
	static get href() {
		return this._href;
	}
	static set href(value) {
		this._href = value;
	}
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.main());
	}
	static properties = {
		view: {},
		href: {
			get() {
				return this._.href || SvgIcon._href;
			},
			set(value) {
				this._$.href.value = `${value}#${this.icon}`;
			}
		},
		icon: {
			set(value) {
				this._$.href.value = `${this.href}#${value}`;
			}
		},
	};
	dom = {
		style: () => {
			const result = document.createDocumentFragment();
			const style = document.createElement('style');
			style.textContent = `
				:host {
					--hue: 200;
					--sat: 80%;
					display: flex;
				}`;
			result.appendChild(style);
			return result;
		},
		main: () => {
			const result = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			result.setAttribute('fill', 'currentColor');
			result.setAttribute('viewBox', '0 0 24 24');			
			result.appendChild(this.use);
			return result;
		},
		use: () => {
			const result = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			result.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', ``);
			this._$.href = result.attributes['xlink:href'];
			return result;
		}
	};
}
SvgIcon.setMeta(import.meta).register('svg-icon');


