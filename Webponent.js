/**
 * Webponent is a custom HTML element that extends HTMLElement.
 * It provides a base structure for creating web components with various utility methods
 * for handling styles, events, attributes, and templates.
 *
 * @class Webponent
 * @extends HTMLElement
 */
export default class Webponent extends HTMLElement {
	/**
	 * The base URL for the web component.
	 * This static property is used to store the base URL that can be used
	 * throughout the web component for making network requests or referencing
	 * resources.
	 * 
	 * @type {string}
	 * @private
	 */
	static _baseUrl = '';

	static _meta;
	static styleUrl;
	/**
	 * Event object.
	 * @type {Object}
	 */
	EVT = {};

	/**
	 * Represents the slot event object.
	 * @type {Object}
	 */
	slotEvt = {};

	/**
	 * @static
	 * @type {Object}
	 * @description An object that holds the observable attributes for the Webponent class.
	 */
	static observedProps;

	/**
	 * (Standard Custom Element property)
	 * The list of attributes to observe for changes.
	 * @type {Array<string>}
	 */
	static get observedAttributes() {
		return [...Object.keys(this.observedProps)];
	};
	/**
	 * Represents a component.
	 * @constructor
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	/**
	 * Callback method called when the custom element is connected to the document's DOM.
	 * Attaches a shadow root and adds styles if specified. Retrieves and appends the template to the shadow root.
	 */
	async connectedCallback() {
		this.constructor.addStyle(this.shadowRoot);

		const template = await this.getTemplate();
		return { template };
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

	/**
	 * Callback function that is called when an observed attribute of the custom element changes.
	 * 
	 * @param {string} name - The name of the attribute that changed.
	 * @param {string|null} oldValue - The old value of the attribute before the change.
	 * @param {string|null} newValue - The new value of the attribute after the change.
	 * 
	 * @returns {void}
	 * @example
	 * static observedProps = {
	 *     age: {
	 * 	   type: Number,
	 * 	   value: 18,
	 * 	   reflect: true,
	 * 	   required: true,
	 * 	   coerce: (value) => parseInt(value),
	 * 	   validate: (value) => value > 0 ? null : value,
	 * };
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		console.log(arguments);

		if (!this.shadowRoot) return;
		const definition = this.constructor.observedProps[name];

		if (typeof definition === 'function') {
			return definition.call(this, newValue);
		}
		if (typeof definition === 'object') {
			return definition.call(this, newValue);
		}
		if (oldValue === null && definition.add) {
			return definition.add.call(this, newValue);
		}
		if (newValue === null && definition.remove) {
			return definition.remove.call(this, oldValue);
		}
		return definition.set.call(this, newValue);
	}
	// attributeChangedCallback(name, oldValue, newValue) {
	//     console.log("onAttributeChanged", name, oldValue, newValue);
	//     if (oldValue === newValue) {
	//         return;
	//     }
	//     if (name === "marks") {
	//         this.page.removeChild(this.page.querySelector(".marks"));
	//         this.page.appendChild(this.dom.marks());
	//     }
	// }
	applyAttributes() {
		for (let attr of this.constructor.observedAttributes) {
			if (this.hasAttribute(attr)) {
				this.attributeChangedCallback(attr, null, this.getAttribute(attr));
			}
		}
	}
	static baseUrl(url) {
		if (!this._baseUrl) {
			this._baseUrl = new URL(this._meta.url).href.split("/").slice(0, -1).join("/");
		}
		if (url) {
			return this._baseUrl + '/' + url;
		}
		return this._baseUrl;
	}
	baseUrl(url) {
		return this.constructor.baseUrl(url);
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
		if (urls.length === 0) {
			if (!this.styleUrl) return this;
			if (this.styleUrl instanceof Array) {
				urls = this.styleUrl;
			} else {
				urls = [this.styleUrl];
			}
		}
		// Apply external styles to the shadow DOM
		urls.forEach(url => {
			const linkElem = document.createElement('link');
			linkElem.setAttribute('rel', 'stylesheet');
			linkElem.setAttribute('href', this.baseUrl(url));
			to.appendChild(linkElem);
		});
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
	addEvents(evt = this.EVT) {
		for (let key in evt) {
			for (let event in evt[key]) {
				this.shadowRoot.querySelectorAll(key).forEach(elem => {
					elem.addEventListener(event, evt[key][event].bind(this));
				});
			}
		}
	}



	/**
	 * Adds event listeners to slot elements within the shadow DOM.
	 *
	 * @param {Object} [evt=this.slotEvt] - An object where keys are slot names and values are event handler functions.
	 * @returns {this} The current instance for chaining.
	 * @private
	 */
	_addSlotEvents(evt = this.slotEvt) {
		for (let key in evt) {
			const selector = key ? 'slot[name="' + key + '"]' : 'slot:not([name])';
			this.shadowRoot.querySelector(selector)?.addEventListener('slotchange', evt[key].bind(this));
		}
		return this;
	}


	/**
	 * Parses a given value and converts it to a pixel value if necessary.
	 *
	 * @param {string|number} value - The value to be parsed. It can be a string with units or a number.
	 * @param {string} [property='width'] - The CSS property for which the value is being parsed.
	 * @returns {number|string} - The parsed value in pixels or the original value if it cannot be converted.
	 */
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
			grid: ['fr'],
		};
		if (typeof value !== 'string') return value;
		// const parts = value.match(/([+-]?)(\d+\.\d+|\d+|\.\d+)([a-zA-Z%]+)?/);
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
			return this.convertToPx(number, unit);
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
			return this.connvertPercentageToPx(number, property);
		}
		return value;
	}
	/**
	 * Converts a percentage value to pixels based on the specified property.
	 *
	 * @param {number} value - The percentage value to convert.
	 * @param {string} [property='width'] - The CSS property to base the conversion on. 
	 *                                       Supported properties are 'width', 'height', 'font-size', 'line-height', 
	 *                                       'padding-*', 'margin-*', 'top', 'right', 'bottom', 'left'.
	 * @returns {number|string} - The converted value in pixels or em units, or a percentage string for unsupported properties.
	 */
	connvertPercentageToPx(value, property = 'width') {
		var result = value / 100;
		if (property === 'font-size' || property === 'line-height') {
			return this.parseValue(`${result}em`);
		}
		let box = this.offsetParent.getBoundingClientRect();
		if (property === 'width') {
			return box.width * result;
		}
		if (property === 'height') {
			return box.height * result;
		}
		if (property.startsWith('padding')) {
			console.error('padding percentage not supported yet');
		}
		if (property.startsWith('margin-')) {
			property = property.replace('margin-', '');
			if (property === 'left' || property === 'right') {
				return box.width * result;
			}
			if (property === 'top' || property === 'bottom') {
				return box.height * result;
			}
		}
		if (['top', 'right', 'bottom', 'left'].includes(property)) {
			console.warn('top, right, bottom, left percentage not fully supported yet. Using margin instead');
			return this.parseValue(`${value}%`, 'margin-' + property);
		}
		return result;
	}
	/**
	 * Converts a given value from a specified unit to pixels.
	 *
	 * @param {number} value - The numerical value to be converted.
	 * @param {string} unit - The unit of the value to be converted. 
	 *                        Supported units are: 'cm', 'mm', 'q', 'in', 'pc', 'pt', 'px'.
	 * @returns {number} - The equivalent value in pixels.
	 */
	convertToPx(value, unit) {
		const pixelRatios = {
			cm: 96 / 2.54,
			mm: 96 / 2.54 / 10,
			q: 96 / 2.54 / 40,
			in: 96,
			pc: 96 / 6,
			pt: 96 / 72,
			px: 1,
		};
		return value * pixelRatios[unit];
	}
	/**
	 * Asynchronously retrieves and returns a cloned template.
	 * 
	 * @returns {Promise<DocumentFragment|boolean>} A promise that resolves to the cloned template if successful, or false if no template is available.
	 */
	async getTemplate() {
		// Template is already loaded, return it
		if (this.template) return this.template;
		// Load the template and return it
		const template = await this.constructor.loadTemplate();
		// There is no template to load
		if (!template) return false;
		// Clone the template and return it
		return this.template = template.cloneNode(true);
	}
	/**
	 * Asynchronously loads an HTML template.
	 *
	 * @returns {Promise<DocumentFragment|boolean>} A promise that resolves to the loaded template content as a DocumentFragment,
	 * or false if no template URL is specified.
	 *
	 * @example
	 * const templateContent = await MyComponent.loadTemplate();
	 * if (templateContent) {
	 *   // Do something with the template content
	 * }
	 */
	static async loadTemplate(templateUrl = this.templateUrl) {
		// Template is already loaded, return it
		if (this._template_) return this._template_;
		// There is no template URL specified
		if (!templateUrl) return false;
		// Load the template and return it
		const htmlString = await fetch(this.baseUrl(templateUrl)).then(response => response.text());
		const doc = new DOMParser().parseFromString(htmlString, 'text/html');
		return this._template_ = doc.querySelector('template').content;
	}
	/**
	 * Defines properties on the class prototype with optional reflection to attributes.
	 * 
	 * @param {Object} props - An object where keys are property names and values are property definitions.
	 * @param {boolean} [props[].reflect] - If true, the property will reflect to an attribute.
	 * @param {*} [props[].value] - The default value of the property.
	 * @param {function} [props[].get] - A getter function for the property.
	 * @param {function} [props[].set] - A setter function for the property.
	 * 
	 * @returns {Function} The class itself for chaining.
	 */
	static defineProps(props) {
		for (let prop in props) {
			const definition = props[prop];
			if (typeof definition === 'function' || typeof definition === 'string') {
				continue;
			}
			if (definition.reflect) {
				const descriptor = {};
				if (definition.value) {
					if (this.hasAttribute(prop)) {
						definition.value = this.getAttribute(prop);
					}
					descriptor.get = () => {
						return this.getAttribute(prop) || definition.value;
					};
					descriptor.set = (value) => {
						this.setAttribute(prop, value);
						definition.value = value;
					};
				} else {
					descriptor.get = definition.get || (() => {
						return this.getAttribute(prop);
					});
					definition.set = descriptor.set || ((value) => {
						if (value == this.getAttribute(prop)) return;
						this.setAttribute(prop, value);
					});
				}
				Object.defineProperty(this.prototype, prop, descriptor);
			}
		}
		return this;
	}

	/**
	 * Initializes the component with the provided metadata.
	 * Loads the template and defines the custom element.
	 *
	 * @param {Object} meta - The metadata for the component.
	 * @returns {Promise<this>} A promise that resolves to the initialized component.
	 */
	static async init(meta) {
		this._meta = meta;

		this._template_ = await this.loadTemplate();
		customElements.define(this.tagName, this);
		return this;
	}
}
