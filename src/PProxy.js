/**
 * PProxy: combine un proxy réactif (watch/unwatch)
 * et la synchronisation optionnelle avec les attributs d'un HTMLElement.
 */
export class PProxy {
	constructor(hostOrTarget = {}, targetIfHost = {}) {
		this.watchers = new Map();
		this.pauseDepth = 0;
		this.pendingEvents = [];
		this.host = PProxy.hasHostAPI(hostOrTarget) ? hostOrTarget : null;
		this.target = this.host ? (targetIfHost || {}) : (hostOrTarget || {});
		return this.createProxy();
	}

	static hasHostAPI(value) {
		return !!value
			&& typeof value.hasAttribute === 'function'
			&& typeof value.getAttribute === 'function'
			&& typeof value.setAttribute === 'function'
			&& typeof value.removeAttribute === 'function';
	}

	createProxy() {
		const handler = {
			get: (target, prop, receiver) => {
				if (Reflect.has(target, prop)) {
					return Reflect.get(target, prop, receiver);
				}

				if (this.host && typeof prop === 'string' && this.host.hasAttribute(prop)) {
					const attrValue = this.host.getAttribute(prop);
					return attrValue;
				}

				return Reflect.get(target, prop, receiver);
			},
			set: (target, prop, value, receiver) => {
				const oldValue = Reflect.get(target, prop, receiver);
				if (Object.is(oldValue, value)) {
					return true;
				}

				const ok = Reflect.set(target, prop, value, receiver);
				if (!ok) {
					return false;
				}

				this.syncAttribute(prop, value);
				this.dispatchChange(prop, value, oldValue);
				return true;
			},
			deleteProperty: (target, prop) => {
				if (!Reflect.has(target, prop)) {
					return true;
				}

				const oldValue = Reflect.get(target, prop);
				const ok = Reflect.deleteProperty(target, prop);
				if (!ok) {
					return false;
				}

				this.syncAttribute(prop, undefined, true);
				this.dispatchChange(prop, undefined, oldValue);
				return true;
			}
		};

		const proxy = new Proxy(this.target, handler);
		this.transferMethods(proxy, ['watch', 'watchOnce', 'unwatch', 'unwatchAll', 'pause', 'resume', 'batch']);

		return proxy;
	}
	transferMethods(dest, methods) {
		methods.forEach((method) => {
			Object.defineProperty(dest, method, {
				value: this[method].bind(this),
				enumerable: false,
				writable: true,
				configurable: true
			});
		});
		return dest;
	}

	syncAttribute(prop, value, isDelete = false) {
		if (!this.host || typeof prop !== 'string') {
			return;
		}

		if (isDelete || value === null || value === undefined || value === false) {
			this.host.removeAttribute(prop);
			return;
		}

		this.host.setAttribute(prop, value === true ? '' : String(value));
	}

	watch(propName, listener, options = {}) {
		if (Array.isArray(propName)) {
			const unwatchFns = propName.map((name) => this.watch(name, listener, options));
			return () => unwatchFns.forEach((fn) => fn());
		}

		if (typeof listener !== 'function') {
			throw new TypeError('Listener must be a function');
		}

		if (!this.watchers.has(propName)) {
			this.watchers.set(propName, []);
		}

		const once = options.once === true;
		const immediate = options.immediate !== false;

		if (immediate && propName !== '*' && Object.prototype.hasOwnProperty.call(this.target, propName)) {
			try {
				listener(this.target[propName], undefined, propName);
			} catch (error) {
				console.error(`Error in initial call for ${String(propName)}:`, error);
			}
		}

		this.watchers.get(propName).push({ fn: listener, once });
		return () => this.unwatch(propName, listener);
	}

	watchOnce(propName, listener, options = {}) {
		return this.watch(propName, listener, { ...options, once: true });
	}

	unwatch(propName, listener) {
		if (Array.isArray(propName)) {
			propName.forEach((name) => this.unwatch(name, listener));
			return;
		}

		const listeners = this.watchers.get(propName);
		if (!listeners || listeners.length === 0) {
			return;
		}

		const index = listeners.findIndex((item) => item.fn === listener);
		if (index > -1) {
			listeners.splice(index, 1);
		}
	}

	unwatchAll(propName) {
		if (propName === undefined) {
			this.watchers.clear();
			return;
		}

		if (Array.isArray(propName)) {
			propName.forEach((name) => this.unwatchAll(name));
			return;
		}

		this.watchers.set(propName, []);
	}

	pause() {
		this.pauseDepth += 1;
	}

	resume() {
		if (this.pauseDepth === 0) {
			return;
		}

		this.pauseDepth -= 1;
		if (this.pauseDepth === 0) {
			this.flushPendingEvents();
		}
	}

	batch(work) {
		if (typeof work !== 'function') {
			throw new TypeError('Batch requires a function');
		}

		this.pause();
		try {
			return work();
		} finally {
			this.resume();
		}
	}

	isPaused() {
		return this.pauseDepth > 0;
	}

	dispatchChange(propName, newValue, oldValue) {
		if (this.isPaused()) {
			this.pendingEvents.push({ propName, newValue, oldValue });
			return;
		}

		this.notifyWatchers(propName, newValue, oldValue);
		this.notifyWatchers('*', { propName, newValue, oldValue }, undefined);
	}

	flushPendingEvents() {
		if (this.pendingEvents.length === 0) {
			return;
		}

		const events = this.pendingEvents.slice();
		this.pendingEvents.length = 0;

		for (const event of events) {
			this.notifyWatchers(event.propName, event.newValue, event.oldValue);
			this.notifyWatchers('*', {
				propName: event.propName,
				newValue: event.newValue,
				oldValue: event.oldValue
			}, undefined);
		}
	}

	notifyWatchers(propName, newValue, oldValue) {
		const listeners = this.watchers.get(propName) || [];
		for (let i = listeners.length - 1; i >= 0; i--) {
			const listenerObj = listeners[i];
			try {
				listenerObj.fn(newValue, oldValue, propName);
				if (listenerObj.once) {
					listeners.splice(i, 1);
				}
			} catch (error) {
				console.error(`Error in listener for ${String(propName)}:`, error);
			}
		}
	}

	/**
	 * Fonctions d'assertion de type
	 */
	static asserts = {
		Number: (value) => {
			const v = Number(value);
			return Number.isNaN(v) ? undefined : v;
		},
		Boolean: (value) => {
			if (typeof value === 'string') return true;
			return Boolean(value);
		},
		Integer: (value) => {
			const v = parseInt(value, 10);
			return Number.isNaN(v) ? undefined : v;
		},
		Float: (value) => {
			const v = parseFloat(value);
			return Number.isNaN(v) ? undefined : v;
		},
		URL: (value) => {
			try {
				const base = typeof location !== 'undefined' ? location.href : undefined;
				return new URL(value, base);
			} catch {
				return undefined;
			}
		}
	};
}

export default PProxy;
