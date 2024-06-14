export default class Component extends HTMLElement {
	evt = {};
	styleUrl = "style.css";
	static observedAttributes = [];
	constructor() {
		super();
	}
	connectedCallback() {
		console.log("Custom element added to page.");
		this.shadow = this.attachShadow({ mode: 'open' });
		if (this.styleUrl) {
			this.addStyle(this.styleUrl);
		}
		// Attach the created elements to the shadow dom
		// this.dom = this.constructor.dom.cloneNode(true);
		// if (this.dom.tagName === 'TEMPLATE') {
		// 	[...this.constructor.dom.children].forEach(child => {
		// 		this.shadow.appendChild(child);
		// 	});
		// } else {
		// 	this.shadow.appendChild(this.dom);
		// }
	}

	disconnectedCallback() {
		console.log("Custom element removed from page.");
	}

	adoptedCallback() {
		console.log("Custom element moved to new page.");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(`Attribute ${name} has changed.`);
	}
	get dom() {
		if (!this._dom) {
			this._dom = this.domCreate();
			this._dom.obj = this;
		}
		return this._dom;
	}
	get baseUrl() {
		return new URL(this.constructor.url).href.split("/").slice(0, -1).join("/");
	}
	domCreate() {
		// Create a div element
		const div = document.createElement('div');
		const slot = div.appendChild(document.createElement('slot'));
		slot.textContent = 'Component';
		return div;
	}
	static register() {
		customElements.define(this.tagName, this);
		return this;
	}
	setStyle(style, obj = this) {
		for (let propertyName in style) {
			obj.style.setProperty(propertyName, style[propertyName]);
		}
		return this;
	}
	addStyle(...urls) {
		// Apply external styles to the shadow DOM
		urls.forEach(url => {
			const linkElem = document.createElement('link');
			linkElem.setAttribute('rel', 'stylesheet');
			linkElem.setAttribute('href', `${this.baseUrl}/${url}`);
			this.shadow.appendChild(linkElem);
		});
		return this;
	}
	addEvents(evt = this.evt) {
		for (let key in evt) {
			for (let event in evt[key]) {
				this.shadow.querySelectorAll(key).forEach(elem => {
					elem.addEventListener(event, evt[key][event].bind(this));
				});
			}
		}
	}
	parseValue(value, property = 'width') {
		const allUnits = {
			absolute: ['cm', 'mm', 'q', 'in', 'pc', 'pt', 'px'],
			font: ['cap', 'rcap', 'em', 'rem', 'ex', 'rex', 'ch', 'rch', 'ic', 'ric', 'lh', 'rlh'],
			viewport: ['vw', 'vh', 'vmin', 'vmax', 'vb', 'lvb', 'dvb', 'vi', 'lvi', 'dvi'],
			containerquery: ['cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax'],
			angle: ['deg', 'grad', 'rad', 'turn'],
			percentage: ['%'],
			time: ['s', 'ms'],
			frequency: ['Hz', 'kHz'],
			resolution: ['dpi', 'dpcm', 'dppx'],
			grid: ['fr']
		};
		if (typeof value !== 'string') return value;
		const parts = value.match(/([+-]?)(\d+\.\d+|\d+|\.\d+)([a-zA-Z%]+)?/);
		var [found, sign, number, unit] = value.match(/([+-]?)(\d+\.\d+|\d+|\.\d+)([a-zA-Z%]+)?/);
		sign = (sign === '-') ? -1 : 1;
		number *= sign;
		property = property.replace(/[A-Z]/g, '-$&').toLowerCase();
		if (!unit) {
			if (property === 'line-height') {
				return this.parseValue(`${number}em`);
			}
			return parseFloat(value);
		}
		unit = unit.toLowerCase();
		if (allUnits.absolute.includes(unit)) {
			const pixelRatios = {
				cm: 96 / 2.54,
				mm: 96 / 2.54 / 10,
				q: 96 / 2.54 / 40,
				in: 96,
				pc: 96 / 6,
				pt: 96 / 72,
				px: 1,
			};
			return number * pixelRatios[unit];
		}
		let dummy = this.appendChild(document.createElement('div'));
		dummy.style.position = 'absolute';
		if ([...allUnits.font, ...allUnits.viewport].includes(unit)) {
			dummy.style.width = found;
			let result = parseFloat(getComputedStyle(dummy).width);
			dummy.remove();
			return result;
		}
		if (allUnits.percentage.includes(unit)) {
			number /= 100;
			if (property === 'font-size' || property === 'line-height') {
				return this.parseValue(`${number}em`);
			}
			let box = this.offsetParent.getBoundingClientRect();
			if (property === 'width') {
				return box.width * number;
			}
			if (property === 'height') {
				return box.height * number;
			}
			if (property.startsWith('padding')) {
				console.error('padding percentage not supported yet');
			}
			if (property.startsWith('margin-')) {
				property = property.replace('margin-', '');
				if (property === 'left' || property === 'right') {
					return box.width * number;
				}
				if (property === 'top' || property === 'bottom') {
					return box.height * number;
				}
			}
			if (['top', 'right', 'bottom', 'left'].includes(property)) {
				console.warn('top, right, bottom, left percentage not fully supported yet. Using margin instead');
				return this.parseValue(found, 'margin-' + property);
			}
			return number;
		}
	}
}
