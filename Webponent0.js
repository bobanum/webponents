import Utils from "./src/Utils.js";

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
	static Utils = Utils;
	static _baseUrl = '';
	static _appUrl = '';

	static _meta = {};
	static styleUrl;
	
	/**
	 * Event listener object.
	 * @type {Object}
	 */
	EVT = {};
	/**
	 * DOM creation functions object.
	 * @type {Object}
	 * @example
	DOM = {};

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
		if (!this.observedProps) return [];
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
	connectedCallback() {
		var dom;
		this.addStyle();
		if (this.DOM?.style) {
			this.shadowRoot.appendChild(this.DOM.style());
		}

		if (this.DOM?.main) {
			dom = this.DOM.main();
		}

		this.shadowRoot.appendChild(dom);
		return dom;
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
		if (!this.shadowRoot) return;
		const definition = this.constructor.observedProps[name];

		if (typeof definition === 'function') {
			return definition.call(this, newValue);
		}
		
		if (newValue === null) {
			return definition.remove?.call(this, oldValue);
		}
		 else if (oldValue === null) {
			definition.add?.call(this, newValue);
		} else {
			definition.change?.call(this, newValue);
		}
		definition.set?.call(this, newValue);
	}
	applyAttributes() {
		for (let attr of this.constructor.observedAttributes) {
			if (this.hasAttribute(attr)) {
				this.attributeChangedCallback(attr, null, this.getAttribute(attr));
			}
		}
	}
	static appUrl(url = ".") {
		return new URL(url, location.href);
	}
	appUrl(url) {
		return this.constructor.appUrl(url);
	}
	static baseUrl(url = ".") {
		if (!this._meta) return this.appUrl(url);
		return new URL(url, this._meta.url);
	}
	baseUrl(url) {
		return this.constructor.baseUrl(url);
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
		Utils.addStyle(to, urls.map(this.baseUrl.bind(this)));
		return this;
	}
	zzzprocessEvents(root = this.shadowRoot, evt = this.EVT) {
		if (!evt) return;
		// this._addSlotEvents(root);
		for (let selector in evt) {
			this.addEventsTo([...root.querySelectorAll(selector)], evt[selector]);
		}
	}
	//TODO Clean UP MESS...
	zzzaddListener(eventNames, listener, ...objects) {
		if (typeof eventNames === 'string') {
			eventNames = eventNames.split(' ');
		}
		eventNames.forEach(eventName => {
			this.addEventTo(eventName, listener, ...objects);
		});
	}
	static zzzaddListenerTo(listener, eventNames, ...objects) {
		if (typeof eventNames === 'string') {
			eventNames = eventNames.split(/[\s|]+/);
		}
		eventNames.forEach(evtName => {
			objects = objects.flat();
			objects.forEach(object => {
				object.addEventListener(evtName, listener.bind(this));
			});
		});
		return this;
	}
	zzzaddEventsTo(objects, events) {
		if (typeof objects === 'string') {
			objects = [...this.shadowRoot.querySelectorAll(objects)];
		}
		if (!Array.isArray(objects)) {
			objects = [objects];
		}
		for (let eventName in events) {
			objects.forEach(object => {
				this.addEventTo(object, eventName, events[eventName]);
			});
		}
		return this;
	}
	zzzaddEventTo(object, eventName, listener) {
		if (typeof eventName === 'string') {
			eventName = eventName.split(/\s+/);
		}
		eventName.forEach(evtName => {
			object.addEventListener(evtName, listener.bind(this));
		});
		return this;
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
	static get meta() {
		return this._meta;
	}
	static set meta(meta) {
		this._meta = meta;
		this._baseUrl = Utils.parseUrl(meta.url);
	}
	/**
	 * Initializes the component with the provided metadata.
	 * Loads the template and defines the custom element.
	 *
	 * @param {Object} meta - The metadata for the component.
	 * @returns {Promise<this>} A promise that resolves to the initialized component.
	 */
	static async init(meta) {
		if (meta) {
			this.meta = meta;
		}
		// console.log(this.DOM, super.DOM);

		if (this.DOM && super.DOM) {
			this.DOM = Object.assign(Object.create(super.DOM), this.DOM);
		}
		if (this.EVT && super.EVT) {
			this.EVT = Object.assign(Object.create(super.EVT), this.EVT);
		}
		this._appUrl = Utils.parseUrl(location.href);

		customElements.define(this.tagName, this);
		
		return this;
	}
	static trackKeyModifiers(e) {
		if (window.keyModifiers !== undefined) return;
		console.log("Tracking key modifiers...", window.keyModifiers);
		
		window.keyModifiers = 0;
		window.MODIFIERS = {
			SHIFT: 1,
			CTRL: 2,
			ALT: 4,
			META: 8,
			CAPS: 16,
			NUM: 32,
			ALTGR: 64,
			OS: 128,
		};
		this.addListenerTo(e => {
			if (e.repeat) return;
			
			window.keyModifiers = ["Shift", "Control", "Alt", "Meta", "CapsLock", "NumLock", "AltGraph", "OS"].reduce((acc, key, i) => {
				let state = e.getModifierState(key);
				
				document.documentElement?.classList.toggle(key + "Key", state);
				acc += e.getModifierState(key) << i;
				return acc;
			}, 0);
		}, ["keydown", "keyup"], window);
	}
}
