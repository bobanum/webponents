import Webponent from "../Webponent.js";

export default class Button extends Webponent {
    static url = import.meta.url;
    static tagName = 'button-ponent';
    constructor() {
        super();

        // Add a click event listener to the button
        this.dom.addEventListener('click', () => {
            alert('Button clicked!');
        });
    }
	domCreate() {
        // Create a button element
        const button = document.createElement('button');
        const slot = button.appendChild(document.createElement('slot'));
        slot.textContent = 'Click me';
        const img = button.appendChild(document.createElement('img'));
        img.setAttribute('src', 'https://www.w3schools.com/images/stickman.gif');
		return button;
	}
}
Button.register();
