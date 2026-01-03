export default class Webponent extends HTMLElement {
	static prefix = '';
	static suffix = 'ponent';
	static meta;
	constructor() {
		super();
		this._ = this.createProxy();

		this._$ = {};
		this.attachShadow({ mode: 'open' });
	}
	createProxy(obj = {}) {
		return new Proxy(obj, {
			// construct: (target, ...args) => {
			// 	return new target(...args);
			// },
			// defineProperty: function (target, name, descriptor) {
			// 	const desc = Object.getOwnPropertyDescriptors(this);				
			// 	Object.defineProperty(target, name, {get: desc.get.value, set: desc.set.value, enumerable: true, configurable: true});
			// 	return true;
			// },
			get: (target, name) => {
				return target[name];
			},
			set: (target, name, value) => {
				if (target[name] === value) {
					return true;
				}
				target[name] = value;

				if (this.hasAttribute(name) && this.getAttribute(name) === value) {
					return true;
				}
				if (value === null || value === undefined || value === false) {
					this.removeAttribute(name);
				} else {
					if (value === true) {
						value = '';
					}
					this.setAttribute(name, value);
				}
				return true;
			}
		});
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this[name] = newValue;
	}
	static properties = {};
	static setMeta(meta) {
		this.meta = meta;
		this.getUrlData(this.meta.url);
		return this;
	}
	static get observedAttributes() {
		return this.defineProperties(this.properties);
	}
	static defineProperties(descriptors = {}) {
		for (const [name, descriptor] of Object.entries(descriptors)) {
			this.defineProperty(name, descriptor);
		}
		return Object.keys(descriptors);
	}
	static asserts = {
		Number: (value) => {
			if (value instanceof Number) return value;
			value = Number(value);
			if (isNaN(value)) return undefined;
			return value;
		},
		Boolean: (value) => {
			if (value instanceof Boolean) return value;
			return value === 'false' ? false : typeof value === 'string' ? true : Boolean(value);
		},
		Integer: (value) => {
			if (value instanceof Number) return Math.floor(value);
			value = parseInt(value);
			if (isNaN(value)) return undefined;
			return value;
		},
		Float: (value) => {
			if (value instanceof Number) return value;
			value = parseFloat(value);
			if (isNaN(value)) return undefined;
			return value;
		}
	};

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
		prop.assert ??= this.asserts[prop.type.name] ?? prop.type;
		const descriptor = {
			get() {
				let result = prop.get ? prop.get.call(this) : (name in this._) ? this._[name] : prop.default;
				return result;
			},
			set(value) {
				value = prop.assert.call(this, value);
				if (value === undefined || this._[name] === value) return;
				this._[name] = value;
				if (prop.set) {
					prop.set.call(this, value);
				}
			}
		};

		Object.defineProperty(this.prototype, name, descriptor);
	}
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
	static createProperties(descriptors = {}) {
		const result = {};
		for (const [name, descriptor] of Object.entries(descriptors)) {
			result[name] = this.createProperty(name, descriptor)[name];
		}
		return result;
	}
	static fixed(name, prefix = this.prefix, suffix = this.suffix) {
		let result = this.toKebabCase(name || this.name);
		if (prefix && !result.startsWith(`${prefix}-`)) {
			result = `${prefix}-${result}`;
		}
		if (suffix && !result.endsWith(`-${suffix}`)) {
			result += `-${suffix}`;
		}
		return result;
	}
	static getUrlData(url, obj = this) {
		const urlObj = new URL(url);
		for (const [key, value] of urlObj.searchParams.entries()) {
			obj[key] = value;
		}
		return obj;
	}
	static toKebabCase(name) {
		return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}
	static register(name, prefix = this.prefix, suffix = this.suffix) {
		if (this.meta) {
			console.log(this);
		}
		name = this.fixed(name, prefix, suffix);
		if (!customElements.get(name)) {
			console.log(`Registering custom element: ${name}`);
			customElements.define(name, this);
		}
	}
}