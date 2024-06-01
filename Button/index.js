import Component from "../Component.js";

export default class Button extends Component {
    static url = import.meta.url;
    static tagName = 'wp-button';
    constructor() {
        super();

        // Add a click event listener to the button
        this.dom.addEventListener('click', () => {
            alert('Button clicked!');
        });
    }
	static domCreate() {
        // Create a button element
        const button = document.createElement('button');
        const slot = button.appendChild(document.createElement('slot'));
        slot.textContent = 'Click me';
        const img = button.appendChild(document.createElement('img'));
        img.setAttribute('src', 'https://www.w3schools.com/images/stickman.gif');
		return button;
	}
}
Button.init();
