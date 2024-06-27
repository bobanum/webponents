import Component from "../Component.js";
class Instance extends Component {
	styleUrl = "";
	static url = import.meta.url;
	static tagName = 'wp-instance';
	static observedAttributes = ["href"];

	constructor() {
		super();
		console.log('Instance constructor');

	}
	connectedCallback() {
		console.log("Custom element added to page I.", this.href);
		super.connectedCallback();
		console.log('Window constructor mid');
			const template = document.querySelector(this.href).content;
			this.shadow.appendChild(template);
		}
	attributeChangedCallback(name, oldValue, newValue) {
		console.log(`Attribute ${name} has changed. from ${oldValue} to ${newValue}`);
		if (newValue == oldValue) return;
		if (name === 'href') {
			this.href = newValue;
			// const template = document.querySelector(newValue).content.cloneNode(true);
			// this.shadow.appendChild(template);
		}
	}

}
export class zzzTemplate {
	static main() {
		const instances = document.querySelectorAll(this.selector);
		instances.forEach(instance => {
			this.processInstance(instance);
		});
	}
	static processInstance(instance) {
		const href = instance.getAttribute('href');
		const template = document.querySelector(href).content.cloneNode(true);
		const slot = template.querySelector('slot');
		if (slot) {
			const nodes = [...instance.childNodes];
			nodes.forEach(node => {
				slot.parentNode.insertBefore(node, slot);
			});
			slot.remove();
		}
		instance.replaceWith(template);
	}
	static processSlot(slot) {
		const nodes = [...slot.childNodes];
		nodes.forEach(node => {
			slot.parentNode.insertBefore(node, slot);
		});
		slot.remove();
	}
	static processTemplate(template) {
		if (typeof template === 'string') {
			template = document.querySelector(template);
		}
		const result = template.content.cloneNode(true);
	}
}
Instance.register();