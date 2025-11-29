import Webponent from "../Webponent.js";

/**
 * Represents the Starter component.
 * @extends Webponent
 */
export default class Starter extends Webponent {
    /**
     * The tag name of the Starter component.
     * @type {string}
     */
    static tagName = 'starter-ponent';

    /**
     * The template file for the Starter component. (optional)
     * @type {string}
     */
    // static templateUrl = 'index.tpl';
    // static styleUrl = "style.css";

    constructor() {
        super();
    }

    /**
     * Called when the Starter component is connected to the DOM.
     * @override
     */
    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.appendChild(document.createElement('slot'));
        return;
    }
    DOM = {
        main: () => {
            const main = document.createElement('div');
            main.textContent = 'Starter Component';
            return main;
        },
    };
    /**
     * Event handlers for the Starter component.
     * @type {Object}
     */
    static EVT = {
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
     * The observed attributes for the Starter component.
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
 * Initializes the Starter component.
 */
Starter.init(import.meta);