export default class Component extends HTMLElement {
	static suffix = 'ponent';
	constructor() {
		super();
		this._ = this.createProxy();
		this.attachShadow({ mode: 'open' });
	}
	static get observedAttributes() {
		Object.defineProperties(this.prototype, this.properties);
		return Object.keys(this.properties);
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
	static suffixed(name, suffix = this.suffix) {
		name = this.toKebabCase(name || this.name);
		if (name.endsWith(`-${suffix}`)) {
			return name;
		}
		return `${name}-${suffix}`;
	}
	static toKebabCase(name) {
		return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
	}
	static register(name, suffix = this.suffix) {
		name = this.suffixed(name, suffix);
		if (!customElements.get(name)) {
			console.log(`Registering custom element: ${name}`);
			customElements.define(name, this);
		}
	}
}