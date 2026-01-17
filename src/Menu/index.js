import Webponent from "../Webponent.js";
import "./item.js";
import menuCss from './menu.css';

export class Menu extends Webponent {
	connectedCallback() {
		if (this.hasAttribute('src')) {
			let url = this.getAttribute('src');
			fetch(url)
				.then(response => {
					if (url.endsWith('.txt') || this.getAttribute('type') === 'text') {
						return response.text().then(text => this.text2json(text));
					} else {
						return response.json();
					}
				})
				.then(data => {
					this.items = data;
				})
				.catch(err => {
					console.error('Error loading menu JSON:', err);
				});
		} else if (this.getAttribute('type') === 'text') {
			this.items = this.text2json(this.textContent);
		}
		this.shadowRoot.appendChild(super.dom.style(menuCss));
		this.shadowRoot.appendChild(this.dom.main());
	}
	set items(value) {
		this.textContent = '';
		this.appendChild(this.json2ponent(value));
	}
	dom = {
		main: () => {
			const result = document.createDocumentFragment();
			result.appendChild(document.createElement('slot'));
			return result;
		}
	};
	splitTopLevel(s, sep = ';') {
		const parts = [];
		let start = 0;
		let depth = 0;
		for (let i = 0; i < s.length; i++) {
			const ch = s[i];
			if (ch === '(') {
				depth++;
			} else if (ch === ')') {
				depth = Math.max(0, depth - 1);
			} else if (ch === sep && depth === 0) {
				parts.push(s.slice(start, i));
				start = i + 1;
			}
		}
		parts.push(s.slice(start));
		return parts.map(p => p.trim()).filter(Boolean);
	};

	parseItem(s) {
		let label = '';
		let rest = '';
		const pipe = s.indexOf('|');
		if (pipe >= 0) {
			label = s.slice(0, pipe).trim();
			rest = s.slice(pipe + 1).trim();
		} else {
			label = s.trim();
			rest = '';
		}

		let href = '';
		let icon = null;
		let children = [];

		// detect children parentheses at top-level in rest
		let parenIdx = -1;
		for (let i = 0; i < rest.length; i++) {
			if (rest[i] === '(') {
				parenIdx = i;
				break;
			}
		}
		if (parenIdx >= 0) {
			// find matching closing paren
			let depth = 0;
			let end = -1;
			for (let i = parenIdx; i < rest.length; i++) {
				if (rest[i] === '(') {
					depth++;
				} else if (rest[i] === ')') {
					depth--;
					if (depth === 0) {
						end = i; break;
					}
				}
			}
			const hrefPart = rest.slice(0, parenIdx).trim();
			href = hrefPart;
			if (end > parenIdx) {
				const inner = rest.slice(parenIdx + 1, end);
				children = this.splitTopLevel(inner, ';').map(this.parseItem.bind(this));
			}
		} else {
			href = rest;
		}

		// parse optional icon prefix like [icon.png]href
		if (href && href.startsWith('[')) {
			const close = href.indexOf(']');
			if (close > 0) {
				icon = href.slice(1, close).trim();
				href = href.slice(close + 1).trim();
			}
		} else {
			const m = href.match(/^\s*\[([^\]]+)\](.*)$/);
			if (m) {
				icon = m[1].trim();
				href = m[2].trim();
			}
		}

		return { label, href, icon, children };
	};
	text2json(text) {
		if (!text) return [];

		const items = this.splitTopLevel(text, ';').map(this.parseItem.bind(this));
		return items;
	}
	text2ponent(text) {
		const json = this.text2json(text);
		return this.json2ponent(json);
	}
	json2ponent(json) {
		const menuEl = document.createDocumentFragment();
		json.forEach(item => {
			const itemElement = document.createElement('menu-item-ponent');
			Object.entries(item).forEach(([key, value]) => {
				itemElement[key] = value;
			});

			menuEl.appendChild(itemElement);
		});

		return menuEl;
	}
}
Menu.register('menu');
export default Menu;

