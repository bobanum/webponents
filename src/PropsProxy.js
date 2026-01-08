export default class PropsProxy {
	constructor(that = {}, target) {
		this.that = that;
		this.target = target;
		return this.createProxy(that, target);
	}

	/**
	 * Creates a proxy for automatic attribute-property synchronization.
	 * The proxy intercepts property changes and synchronizes them with HTML attributes.
	 * 
	 * @param {Object} [props={}] - Initial object to wrap in the proxy
	 * @returns {Proxy} Proxied object that syncs with attributes
	 * 
	 * @example
	 * // When you set a property on the proxy:
	 * this._.disabled = true;
	 * // It automatically updates the attribute:
	 * this.setAttribute('disabled', '');
	 */
	createProxy(that, props = {}) {
		return new Proxy(props, {
			get: function(target, name) {
				if (name in target) {
					return target[name];
				}
				return this.getAttribute(name);
			}.bind(that),
			set: function(target, name, value) {
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
			}.bind(that)
		});
	}

	/**
	 * Built-in type assertion functions for common data types.
	 * Used to validate and coerce property values to the expected type.
	 * 
	 * @type {Object.<string, Function>}
	 * @static
	 * 
	 * @property {Function} Number - Converts to number, returns undefined if NaN
	 * @property {Function} Boolean - Converts to boolean ('false' string → false)
	 * @property {Function} Integer - Converts to integer using parseInt
	 * @property {Function} Float - Converts to float using parseFloat
	 */
	static asserts = {
		"Number": (value) => {
			if (value instanceof Number) return value;
			value = Number(value);
			if (isNaN(value)) return undefined;
			return value;
		},
		"Boolean": (value) => {
			if (value instanceof Boolean) return value;
			return value === 'false' ? false : typeof value === 'string' ? true : Boolean(value);
		},
		"Integer": (value) => {
			if (value instanceof Number) return Math.floor(value);
			value = parseInt(value);
			if (isNaN(value)) return undefined;
			return value;
		},
		"Float": (value) => {
			if (value instanceof Number) return value;
			value = parseFloat(value);
			if (isNaN(value)) return undefined;
			return value;
		},
		"URL": (value) => {
			try {
				return new URL(value, location);
			} catch {
				return undefined;
			}
		}
	};

}
