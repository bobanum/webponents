export default class Component extends HTMLElement {
	static prefix = '';
	static suffix = 'ponent';
	static meta;
	constructor() {
		super();
		this._ = this.createProxy();
		this._$ = {};
		this.attachShadow({ mode: 'open' });
	}
	static setMeta(meta) {
		this.meta = meta;
		this.getUrlData(this.meta.url);
		return this;
	}
	static get observedAttributes() {
		Object.defineProperties(this.prototype, this.properties);
		return Object.keys(this.properties);
	}
	static getUrlData(url, obj = this) {
		const urlObj = new URL(url);
		for (const [key, value] of urlObj.searchParams.entries()) {
			obj[key] = value;
		}
		return obj;
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
	createProxy(obj = {}) {
		return new Proxy(obj, {
			get: function (target, name) {
				return target[name];
			}.bind(this),
			set: function (target, name, value) {
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
					console.log(name, value);

					this.setAttribute(name, value);
				}
				return true;
			}.bind(this)
		});
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this[name] = newValue;
	}
	static properties = {};
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
	static toKebabCase(name) {
		return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}
	static register(name, prefix = this.prefix, suffix = this.suffix) {
		if (this.meta) {
			console.log
				(this);
		}
		name = this.fixed(name, prefix, suffix);
		if (!customElements.get(name)) {
			console.log(`Registering custom element: ${name}`);
			customElements.define(name, this);
		}
	}
}