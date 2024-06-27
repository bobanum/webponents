/**
 * Represents a custom component that extends the HTMLElement class.
 * @class Component
 * @extends HTMLElement
 */
export default class Component extends HTMLElement {
	/**
	 * Event object.
	 * @type {Object}
	 */
	evt = {};
	
	/**
	 * Represents the slot event object.
	 * @type {Object}
	 */
	slotEvt = {};
	
	/**
	 * The list of attributes to observe for changes.
	 * @type {Array<string>}
	 */
	static observedAttributes = [];
	/**
	 * Represents a component.
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Callback method called when the custom element is connected to the document's DOM.
	 * Attaches a shadow root and adds styles if specified. Retrieves and appends the template to the shadow root.
	 */
	connectedCallback() {
		// console.log("Custom element added to page.");
		this.attachShadow({ mode: 'open' });
		this.addStyle();

		this.getTemplate().then(template => {
			if (template) {
				this.shadowRoot.appendChild(template);
			}
			this.addEvents();
			this.addSlotEvents();
			// debugger;
			this.applyAttributes();
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
		if (!this.shadowRoot) return;
		const fn = this.constructor.observableAttributes[name];
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
	applyAttributes() {
		for (let attr of this.constructor.observedAttributes) {
			if (this.hasAttribute(attr)) {
				this.attributeChangedCallback(attr, null, this.getAttribute(attr));
			}
		}
	}
	static baseUrl(url) {
		const base = new URL(this.url).href.split("/").slice(0, -1).join("/");
		return url ? base + '/' + url : base;
	}
	baseUrl(url) {
		return this.constructor.baseUrl(url);
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
		this.constructor.addStyle(this.shadowRoot, ...urls);
		return this;
	}
	static addStyle(to, ...urls) {
		if (urls.length > 0) {
			// Apply external styles to the shadow DOM
			urls.forEach(url => {
				const linkElem = document.createElement('link');
				linkElem.setAttribute('rel', 'stylesheet');
				linkElem.setAttribute('href', this.baseUrl(url));
				to.appendChild(linkElem);
			});
			return this;
		}
		if (this.styleUrl) {
			this.addStyle(to, this.styleUrl);
			return this;
		}
		return this;
	}
	transferStyles(from, to) {
		for (let key of from.style) {
			if (!key.startsWith('-')) continue;
			to.style.setProperty(key, from.style.getPropertyValue(key));
			from.style.removeProperty(key);
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
	addSlotEvents(evt = this.slotEvt) {
		for (let key in evt) {
			const selector = key ? 'slot[name="' + key + '"]' : 'slot:not([name])';
			this.shadowRoot.querySelector(selector)?.addEventListener('slotchange', evt[key].bind(this));
		}
		return this;
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
		this.observedAttributes = Object.keys(this.observableAttributes);
	}
	async getTemplate() {
		// debugger;
		// console.log(this.template, this.constructor._template_);
		if (this.template) return this.template;
		return await this.constructor.loadTemplate().then(template => {
			console.log('template1');
			if (!template) return;
			console.log('template2');
			this.template = template.cloneNode(true);
			console.log('template3');
			return template;
		});
	}
	static async loadTemplate() {
		// console.log(this.baseUrl(this.templateUrl), this.templateUrl, this._template_);
		// There is no template URL specified
		if (!this.templateUrl) return;
		// Template is already loaded, return it
		if (!this._template_) {
			// console.log(this.baseUrl(this.templateUrl));
			this._template_ = await fetch(this.baseUrl(this.templateUrl)).then(response => response.text()).then(htmlString => {
				console.log("htmlString");
				const doc = new DOMParser().parseFromString(htmlString, 'text/html');
				return doc.querySelector('template').content;
			});
		}
		return this._template_;
	}
	static init() {
		this._template_ = this.loadTemplate();
		this.observe();
		this.register();
	}
	static observableAttributes = {};
}
