import PropsProxy from "./PropsProxy.js";

/**
 * Base class for creating reactive web components with automatic attribute-property synchronization.
 * Extends HTMLElement to provide a declarative API for defining custom elements with typed properties,
 * built-in type coercion, and shadow DOM support.
 * 
 * @class Webponent
 * @extends {HTMLElement}
 * 
 * @example
 * // Define a simple component
 * class MyButton extends Webponent {
 *   connectedCallback() {
 *     this.shadowRoot.innerHTML = `<button><slot></slot></button>`;
 *   }
 *   static properties = {
 *     disabled: Boolean
 *   };
 * }
 * MyButton.register();
 * 
 * @example
 * // Use in HTML
 * <my-button-ponent disabled>Click Me</my-button-ponent>
 */
export default class Webponent extends HTMLElement {
	/**
	 * Prefix or suffix (or both) added to the component tag name during registration.
	 * @type {string}
	 * @default '-ponent'
	 * @static
	 */
	static affix = '-ponent';

	/**
	 * Metadata object that can be set via setMeta().
	 * @type {Object|undefined}
	 * @static
	 */
	static meta;

	/**
	 * Reference to the currently rendered heading element in the shadow DOM.
	 * Used to track the element for replacement during re-renders.
	 * 
	 * @type {HTMLElement|null}
	 */
	rendered = null;

	/**
	 * Creates an instance of Webponent.
	 * Initializes the internal proxy for property storage, creates an empty storage object,
	 * and attaches a shadow root in open mode.
	 * 
	 * @constructor
	 */
	constructor() {
		super();
		this._ = new PropsProxy(this);

		/**
		 * Internal storage object.
		 * @type {Object}
		 */
		this._$ = {};
		this.attachShadow({ mode: 'open' });
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this[name] = newValue;
	}
	get dom() {
		return {
			style: (content) => {
				const result = document.createElement("style");
				result.textContent = content;
				return result;
			},
			slot: (name, content) => {
				const result = document.createElement("slot");
				if (name) {
					result.name = name;
				}
				if (typeof content === "string") {
					content = document.createTextNode(content);
				}
				if (content) {
					result.appendChild(content);
				}
				return result;
			}
		};
	}
	static properties = {};

	/**
	 * Sets metadata for the component and extracts URL parameters.
	 * 
	 * @param {Object} meta - Metadata object containing a url property
	 * @param {string} meta.url - URL with query parameters to extract
	 * @returns {typeof Webponent} The class itself for chaining
	 * @static
	 */
	static setMeta(meta) {
		this.meta = meta;
		this.getUrlData(this.meta.url);
		return this;
	}

	/**
	 * Returns an array of attribute names to observe for changes.
	 * Part of the Web Components specification. Automatically called during registration.
	 * 
	 * @returns {string[]} Array of property names to observe as attributes
	 * @static
	 */
	static get observedAttributes() {
		return this.defineProperties(this.properties);
	}

	/**
	 * Defines multiple reactive properties on the component prototype.
	 * 
	 * @param {Object.<string, (PropertyDescriptor|Function|*)>} [descriptors={}] - Object mapping property names to descriptors
	 * @returns {string[]} Array of property names that were defined
	 * @static
	 */
	static defineProperties(descriptors = {}) {
		for (const [name, descriptor] of Object.entries(descriptors)) {
			this.defineProperty(name, descriptor);
		}
		return Object.keys(descriptors);
	}

	/**
	 * Defines a single reactive property on the component prototype.
	 * Handles type coercion, default values, custom getters/setters, and validation.
	 * 
	 * @param {string} name - Property name
	 * @param {PropertyDescriptor|Function|*} prop - Property descriptor, type constructor, or default value
	 * @static
	 * 
	 * @typedef {Object} PropertyDescriptor
	 * @property {Function} [type] - Type constructor (String, Number, Boolean, etc.)
	 * @property {*} [default] - Default value for the property
	 * @property {Function} [assert] - Custom validation/coercion function
	 * @property {Function} [get] - Custom getter function
	 * @property {Function} [set] - Custom setter function (called after value changes)
	 * 
	 * @example
	 * // Full descriptor
	 * defineProperty('count', {
	 *   type: Number,
	 *   default: 0,
	 *   assert(value) { return Math.max(0, value); },
	 *   set(value) { this.render(); }
	 * });
	 * 
	 * @example
	 * // Just a type
	 * defineProperty('name', String);
	 * 
	 * @example
	 * // Default value (type inferred)
	 * defineProperty('active', true);
	 */
	static defineProperty(name, prop) {
		if (typeof prop === 'function') {
			prop = { type: prop };
		} else if (typeof prop !== 'object') {
			prop = {
				type: prop.constructor,
				default: prop,
			};
		}
		if (prop.type === undefined) {
			prop.type = String;
		}
		prop.assert = prop.assert 
			?? PropsProxy.asserts[prop.type.name] 
			?? PropsProxy.asserts[prop.type]
			?? ((typeof prop.type === 'function') ? prop.type : (v) => v);
		
		const descriptor = {
			get() {
				let result = prop.get ? prop.get.call(this)
					: (name in this._) ? this._[name]
						: this.hasAttribute(name) ? prop.assert.call(this, this.getAttribute(name))
							: prop.default;
				return result;
			},
			set(value) {
				value = prop.assert.call(this, value);
				if (value === undefined) {
					delete this._[name];
					return true;
				}

				if (name in this._ && this._[name] === value) return;
				this._[name] = value;
				if (prop.set) {
					prop.set.call(this, value);
				}
			}
		};

		Object.defineProperty(this.prototype, name, descriptor);
	}

	/**
	 * Creates a property descriptor object for a single property.
	 * Helper method for manual property creation.
	 * 
	 * @param {string} name - Property name
	 * @param {Object} [descriptor={}] - Property descriptor with optional get/set methods
	 * @param {Function} [descriptor.get] - Custom getter function
	 * @param {Function} [descriptor.set] - Custom setter function
	 * @returns {Object} Object containing the property descriptor
	 * @static
	 */
	static createProperty(name, descriptor = {}) {
		return {
			[name]: {
				get() {
					let result = descriptor.get ? descriptor.get.call(this) : this._[name];
					return result;
				},
				set(value) {
					if (this._[name] === value) return;
					this._[name] = value;
					if (descriptor.set) {
						descriptor.set.call(this, value);
					}
				}
			}
		};
	}

	/**
	 * Creates multiple property descriptors from a descriptors object.
	 * Helper method for manual property creation.
	 * 
	 * @param {Object.<string, Object>} [descriptors={}] - Object mapping property names to descriptors
	 * @returns {Object} Object containing all property descriptors
	 * @static
	 */
	static createProperties(descriptors = {}) {
		const result = {};
		for (const [name, descriptor] of Object.entries(descriptors)) {
			result[name] = this.createProperty(name, descriptor)[name];
		}
		return result;
	}

	/**
	 * Generates the final custom element tag name with prefix and suffix.
	 * Converts the name to kebab-case and applies prefix/suffix if they don't already exist.
	 * 
	 * @param {string} name - Base name for the component
	 * @returns {string} The formatted tag name in kebab-case with prefix and suffix
	 * @static
	 * 
	 * @example
	 * fixed('MyComponent', 'app', 'widget');
	 * // Returns: 'app-my-component-widget'
	 */
	static fixed(name) {
		let result = this.toKebabCase(name || this.name)
			.replaceAll(/(?:^[_0-9.+]+|[_0-9.+]+$)/g, "");
		const [prefix, suffix] = this.affix.split('-');

		if (prefix && !result.startsWith(`${prefix}-`)) {
			result = `${prefix}-${result}`;
		}
		if (suffix && !result.endsWith(`-${suffix}`)) {
			result = `${result}-${suffix}`;
		}
		return result;
	}

	/**
	 * Extracts query parameters from a URL and assigns them to an object.
	 * 
	 * @param {string} url - URL with query parameters to extract
	 * @param {Object} [obj=this] - Target object to assign parameters to (defaults to the class)
	 * @returns {Object} The target object with extracted parameters
	 * @static
	 * 
	 * @example
	 * getUrlData('https://api.com?page=1&limit=10', {});
	 * // Returns: { page: '1', limit: '10' }
	 */
	static getUrlData(url, obj = this) {
		const urlObj = new URL(url);
		for (const [key, value] of urlObj.searchParams.entries()) {
			obj[key] = value;
		}
		return obj;
	}

	/**
	 * Converts a camelCase or PascalCase string to kebab-case.
	 * 
	 * @param {string} name - String to convert
	 * @returns {string} Kebab-case string
	 * @static
	 * 
	 * @example
	 * toKebabCase('MyComponent');   // 'my-component'
	 * toKebabCase('customButton');  // 'custom-button'
	 */
	static toKebabCase(name) {
		return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}

	/**
	 * Registers the component as a custom HTML element.
	 * 
	 * @param {string} [name] - Custom element tag name (if not provided, uses class name)
	 * @static
	 * 
	 * @example
	 * class MyComponent extends Webponent {}
	 * MyComponent.register();
	 * // Registers as: 'my-component-ponent'
	 * 
	 * @example
	 * MyComponent.register('my-widget');
	 * // Registers as: 'my-widget'
	 */
	static register(name, options = {}) {
		if (options.meta) {
			this.setMeta(options.meta);
			delete options.meta;
		}

		name = this.fixed(name);
		if (!customElements.get(name)) {
			console.log(`Registering custom element: ${name}`);
			customElements.define(name, this, options);
		}
	}
}
