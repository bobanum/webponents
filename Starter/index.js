import Component from "../Component.js";

/**
 * Represents the Starter component.
 * @extends Component
 */
export default class Starter extends Component {
    /**
     * The URL of the Starter component.
     * @type {string}
     */
    static url = import.meta.url;

    /**
     * The tag name of the Starter component.
     * @type {string}
     */
    static tagName = 'wp-starter';

    /**
     * The template file for the Starter component. (optional)
     * @type {string}
     */
    static templateUrl = 'index.tpl';
	static styleUrl = "style.css";

    constructor() {
        super();
    }

    /**
     * Called when the Starter component is connected to the DOM.
     * @override
     */
    connectedCallback() {
        super.connectedCallback();
        return;
    }

    /**
     * Event handlers for the Starter component.
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
     * The observed attributes for the Starter component.
     * @type {Object}
     */
    static observableAttributes = {
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
Starter.init();