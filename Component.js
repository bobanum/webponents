/**
 * Represents a custom component that extends the HTMLElement class.
 * @class Component
 * @extends HTMLElement
 */
export default class Component extends HTMLElement {
	evt = {};
	styleUrl = "style.css";
	static observedAttributes;
	constructor() {
		super();
	}

	/**
	 * Callback method called when the custom element is connected to the document's DOM.
	 * Attaches a shadow root and adds styles if specified. Retrieves and appends the template to the shadow root.
	 */
	connectedCallback() {
		this.shadow = this.attachShadow({ mode: 'open' });
		if (this.styleUrl) {
			this.addStyle(this.styleUrl);
		}

		this.constructor._getTemplate_().then(template => {
			if (template) {
				this.template = template.cloneNode(true);
				this.shadowRoot.appendChild(this.template);
			}
			this.addEvents();
		});
	}

	/**
	 * Called when the custom element is removed from the DOM.
	 */
	disconnectedCallback() {
		console.log("Custom element removed from page.");
	}

	/**
	 * Called when the custom element is moved to a new document.
	 */
	adoptedCallback() {
		console.log("Custom element moved to new page.");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		const fn = this.constructor._observedAttributes[name];
		if (typeof fn === 'function') {
			return fn.call(this, newValue);
		}
		if (oldValue === null && fn.add) {
			return fn.add.call(this, newValue);
		}
		if (newValue === null && fn.remove) {
			return fn.remove.call(this, oldValue);
		}
		return fn.set.call(this, newValue);
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
			this.shadowRoot.appendChild(linkElem);
		});
		return this;
	}
	transferStyles(from, to) {
		for (let key of from.style) {
			to.style.setProperty(key, from.style.getPropertyValue(key));
		}
		from.removeAttribute('style');
		for (let c of from.classList) {
			to.classList.add(c);
		}
		return this;
	}
	addEvents(evt = this.evt) {
		for (let key in evt) {
			for (let event in evt[key]) {
				this.shadowRoot.querySelectorAll(key).forEach(elem => {
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
	static observe() {
		this.observedAttributes = Object.keys(this._observedAttributes);
	}
	async getTemplate() {
		if (this.template) return this.template;
		return await this.constructor._getTemplate_().then(template => {
			if (!template) return;
			this.template = this.cloneNode(true);
			return this.template;
		});
	}
	static async _getTemplate_() {
		if (!this._template_) return;
		if (typeof this._template_ === 'string') {
			this._template_ = await fetch(this._template_).then(response => response.text()).then(htmlString => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlString, 'text/html');
				const fragment = doc.querySelector('template').content;
				return fragment;
			});
		}
		return this._template_;
	}
	static init() {
		this._template_ = this._getTemplate_();
		this.observe();
		this.register();
	}
	static _observedAttributes = {};
}
