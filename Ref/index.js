import Webponent from "../Webponent.js";

/**
 * Represents the Ref component.
 * @extends Webponent
 */
export default class Ref extends Webponent {
    /**
     * The tag name of the Ref component.
     * @type {string}
     */
    static tagName = 'ref-ponent';

    /**
     * The template file for the Ref component. (optional)
     * @type {string}
     */
    // static styleUrl = "style.css";

    /**
     * Called when the Ref component is connected to the DOM.
     * @override
     */
    async connectedCallback() {
        super.connectedCallback();
        const doc = Utils.loadHTML(this.appUrl('page.html'));
        this.shadowRoot.appendChild(doc.querySelectorAll('body').content.cloneNode(true));
        console.log(this.selector);
        
        return;
    }

    get selector() {
        let selector;
        if (this.hasAttribute('selector')) {
            selector = this.getAttribute('selector');
        } else {
            selector = 'body';
        }
        let hash; 
        if (hash = this.href.match(/#([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)$/)) {
            console.log(hash[1]);
        }
    }
    /**
     * Event handlers for the Ref component.
     * @type {Object}
     */
    EVT = {
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
     * The observed attributes for the Ref component.
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
 * Initializes the Ref component.
 */
Ref.init(import.meta);