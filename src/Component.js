import { PProxy } from './PProxy.js';

export class Component extends HTMLElement {
	static affix = '';
	static meta;
	static props = {};
	static properties = {};
	static #definedProps = new WeakMap();

	constructor() {
		super();
		this.__ = {};
		this._ = new PProxy(this, this.__);
		this.attachShadow({ mode: 'open' });
	}

	static get propertyDefinitions() {
		return {
			...(this.properties || {}),
			...(this.props || {})
		};
	}

	static setMeta(meta) {
		this.meta = meta;
		if (meta?.url) {
			this.getUrlData(meta.url, this.meta);
		}
		return this;
	}

	static get observedAttributes() {
		return this.defineProperties(this.propertyDefinitions);
	}

	static defineProperties(descriptors = {}) {
		const attrs = [];
		for (const [name, descriptor] of Object.entries(descriptors)) {
			const normalized = this.normalizeProperty(descriptor);
			this.defineProperty(name, normalized);
			if (normalized.attr !== false) {
				attrs.push(name);
			}
		}
		return attrs;
	}

	static normalizeProperty(prop) {
		if (prop === null) {
			return { skip: true, attr: false };
		}

		if (typeof prop === 'function') {
			prop = { type: prop };
		} else if (typeof prop !== 'object' || prop === undefined) {
			prop = {
				type: prop?.constructor || String,
				default: prop
			};
		} else {
			prop = { ...prop };
		}

		if (!prop.type && prop.default !== undefined && prop.default !== null) {
			prop.type = prop.default.constructor;
		}
		prop.type = prop.type || String;
		prop.assert = prop.assert
			?? PProxy.asserts[prop.type?.name]
			?? PProxy.asserts[prop.type]
			?? (typeof prop.type === 'function' ? prop.type : (value) => value);
		return prop;
	}

	static defineProperty(name, descriptor) {
		const prop = this.normalizeProperty(descriptor);
		if (prop.skip) {
			return;
		}

		let defined = this.#definedProps.get(this);
		if (!defined) {
			defined = new Set();
			this.#definedProps.set(this, defined);
		}
		if (defined.has(name)) {
			return;
		}
		defined.add(name);

		Object.defineProperty(this.prototype, name, {
			configurable: true,
			enumerable: true,
			get() {
				if (prop.get) {
					return prop.get.call(this);
				}

				if (Object.prototype.hasOwnProperty.call(this.__, name)) {
					return this.__[name];
				}

				if (this.hasAttribute(name)) {
					return prop.assert.call(this, this.getAttribute(name));
				}

				return typeof prop.default === 'function' && prop.type !== Function
					? prop.default.call(this)
					: prop.default;
			},
			set(value) {
				let asserted;
				try {
					asserted = prop.assert ? prop.assert.call(this, value) : value;
				} catch {
					throw new Error(`Invalid value for ${name}: ${value}`);
				}

				if (asserted === undefined) {
					delete this._[name];
					return true;
				}

				const currentValue = Object.prototype.hasOwnProperty.call(this.__, name)
					? this.__[name]
					: undefined;
				if (Object.is(currentValue, asserted)) {
					return true;
				}

				if (prop.set) {
					prop.set.call(this, asserted, currentValue);
				} else {
					this._[name] = asserted;
				}

				return true;
			}
		});
	}

	static createProperty(name, descriptor = {}) {
		return {
			[name]: this.normalizeProperty(descriptor)
		};
	}

	static createProperties(descriptors = {}) {
		const result = {};
		for (const [name, descriptor] of Object.entries(descriptors)) {
			result[name] = this.normalizeProperty(descriptor);
		}
		return result;
	}

	static toKebabCase(name = '') {
		return String(name).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}

	static fixed(name) {
		let result = this.toKebabCase(name || this.name).replaceAll(/(?:^[_0-9.+-]+|[_0-9.+-]+$)/g, '');
		if (!this.affix) {
			return result;
		}

		const parts = this.affix.split('-').filter(Boolean);
		const prefix = parts[0];
		const suffix = parts.length > 1 ? parts[parts.length - 1] : '';

		if (prefix && !result.startsWith(`${prefix}-`)) {
			result = `${prefix}-${result}`;
		}
		if (suffix && !result.endsWith(`-${suffix}`) && suffix !== prefix) {
			result = `${result}-${suffix}`;
		}
		return result;
	}

	static getUrlData(url, obj = this) {
		const urlObj = new URL(url, typeof location !== 'undefined' ? location.href : 'http://localhost');
		for (const [key, value] of urlObj.searchParams.entries()) {
			obj[key] = value;
		}
		return obj;
	}

	static register(name, options = {}) {
		const settings = { ...options };
		if (settings.meta) {
			this.setMeta(settings.meta);
			delete settings.meta;
		}

		const tagName = name?.includes('-') ? name : this.fixed(name);
		if (!customElements.get(tagName)) {
			customElements.define(tagName, this, settings);
		}
		return tagName;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		const definitions = this.constructor.propertyDefinitions;
		if (!(name in definitions)) {
			return;
		}

		this[name] = newValue;
	}

	fill(data = {}) {
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}
		return this;
	}

	watchText(propName, element, listener, options = {}) {
		this.watch(propName, () => {
			const value = listener ? listener.call(this, this[propName], propName) : this[propName];
			element.textContent = value ?? '';
		}, options);
		return this;
	}

	watchHTML(propName, element, listener, options = {}) {
		this.watch(propName, () => {
			const value = listener ? listener.call(this, this[propName], propName) : this[propName];
			element.innerHTML = value ?? '';
		}, options);
		return this;
	}

	watchAttribute(propName, element, attrName, listener, options = {}) {
		this.watch(propName, () => {
			const value = listener ? listener.call(this, this[propName], propName) : this[propName];
			if (value === false || value === null || value === undefined) {
				element.removeAttribute(attrName);
			} else {
				element.setAttribute(attrName, value === true ? '' : String(value));
			}
		}, options);
		return this;
	}

	get dom() {
		return {
			style(content) {
				const result = document.createElement('style');
				result.textContent = content;
				return result;
			},
			slot(name, content) {
				const result = document.createElement('slot');
				if (name) {
					result.name = name;
				}
				if (typeof content === 'string') {
					result.appendChild(document.createTextNode(content));
				} else if (content) {
					result.appendChild(content);
				}
				return result;
			}
		};
	}
	static init() {
		['watch', 'watchOnce', 'unwatch', 'unwatchAll', 'batch'].forEach((method) => {
			Object.defineProperty(this.prototype, method, {
				value: function (...args) {
					return this._[method](...args);
				},
				configurable: true,
				enumerable: false,
				writable: true
			});
		});
	}
}
Component.init();

export default Component;
