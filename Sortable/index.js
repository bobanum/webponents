import Webponent from "../Webponent.js";

/**
 * Represents the Sortable component.
 * @extends Webponent
 */
export default class Sortable extends Webponent {
    /**
     * The tag name of the Sortable component.
     * @type {string}
     */
    static tagName = 'sortable-ponent';

    /**
     * The template file for the Sortable component. (optional)
     * @type {string}
     */
    // static templateUrl = 'index.tpl';
	static styleUrl = "style.css";

    constructor() {
        super();
    }

    /**
     * Called when the Sortable component is connected to the DOM.
     * @override
     */
    connectedCallback() {
        super.connectedCallback();
        [...this.children].forEach(child => {
            const slotname = `slot${Math.random().toString(36).substring(1)}`;
            child.setAttribute('slot', slotname);
            const element = this.shadowRoot.appendChild(document.createElement('div'));
            element.classList.add('sortable-item');
            const handle = element.appendChild(document.createElement('span'));
            handle.classList.add('sortable-handle');
            const slot = element.appendChild(document.createElement('slot'));
            slot.setAttribute('name', slotname);
        });
        return;
    }

    /**
     * Event handlers for the Sortable component.
     * @type {Object}
     */
    evt = {
        ".selector": {
            /**
             * Event handler for the specified event.
             * @param {Event} e - The event object.
             */
            eventName: (e) => {
                // Event handler logic
            },
        },
    };
	slotEvt = {
		"": (e) => {
			console.log(this, 'Unnamed slot changed');
		},
		"name": (e) => {
			console.log(this, 'Slot "name" changed');
		}
	};

    /**
     * The observed attributes for the Sortable component.
     * @type {Object}
     */
    static observedProps = {
        'attribute': {
            /**
             * Setter function for the 'attribute' attribute.
             * @param {any} value - The new value of the attribute.
             */
            set: function (value) {
                // Setter logic
            },
        },
    };
}

/**
 * Initializes the Sortable component.
 */
Sortable.init(import.meta);