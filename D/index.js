import Dialog from "../Dialog/index.js";

/**
 * Represents the D component.
 * @extends Webponent
 */
export default class D extends Dialog {
    /**
     * The tag name of the D component.
     * @type {string}
     */
    static _tagName = 'd-ponent';

    // static styleUrl = "style.css";

    // constructor() {
    //     super();
    // }

    /**
     * Called when the D component is connected to the DOM.
     * @override
     */
    // connectedCallback() {
    //     super.connectedCallback();
    //     this.shadowRoot.appendChild(document.createElement('slot'));
    //     return;
    // }
    test() {
        console.log('test');
        return 'test';
    }
    DOMzzz = {
        main: () => {
            console.log(this, 'D component', super.__proto__);
            
            const main = document.createElement('div');
            main.textContent = 'D Component';
            return main;
        },
    };
    /**
     * Event handlers for the D component.
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
     * The observed attributes for the D component.
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
 * Initializes the D component.
 */
console.log('D init', D.prototype.DOM);
D.prototype.DOM = {
    main: () => {
        // console.log(this, 'D component', super.__proto__);
        console.log(this);
        
        const main = document.createElement('div');
        main.textContent = 'D Component';
        return main;
    },
};

D.init(import.meta);