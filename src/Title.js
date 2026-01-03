import Webponent from "./Webponent.js";

export class Title extends Webponent {
	rendered = null;
	connectedCallback() {
		this.render();
		this.addEventListener('click', () => {
			this.level += 1;
		});
	}
	render() {
		const old = this.rendered;
		this.rendered = this.dom.main();
		if (old) {
			old.replaceWith(this.rendered);
		} else {
			this.shadowRoot.appendChild(this.rendered);
		}
		return this.rendered;
	}
	dom = {
		main: () => {
			const result = document.createElement('h' + this.level);
			result.appendChild(document.createElement('slot'));
			return result;
		}
	};
	static properties = {
		level0: {
			default: 1,
			type: Number
		},
		level: {
			type: Number,
			default: 1,
			get() {
				return this._.level;
			},
			set(value) {
				console.log(value);
				
				value = Number(value);
				if (this._.level === value) return;
				this._.level = this.cycle(value);
				if (this.rendered) {
					this.render();
				} 
			}
		}
	};
	cycle(num, min = 1, max = 6) {
		const range = max - min + 1;
		const positive = (num - min) % range + range;
		return positive % range + min;
	}
}
Title.register();