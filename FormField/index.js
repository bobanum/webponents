import Webponent from "../Webponent.js";

/**
 * Represents the Starter component.
 * @extends Webponent
 */
export default class FormField extends Webponent {
    /**
     * The tag name of the Starter component.
     * @type {string}
     */
    static tagName = 'form-field-ponent';

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
        this.shadowRoot.appendChild(this.DOM.style());
        this.shadowRoot.appendChild(this.DOM.main());
        return;
    }
    get tag() {
        return this.getAttribute("tag") || "div";
    }
    get name() {
        if (this.hasAttribute("name")) {
            return this.getAttribute("name");
        }
        let element = this.querySelector("[name]");
        if (element) {
            return element.getAttribute("name");
        }
        element = this.querySelector("[id]");
        if (element) {
            return element.getAttribute("id");
        }
        return "";
    }
    get label() {
        console.log(this.getAttribute("label"), this.querySelector("[slot='label']")?.innerHTML, this.name);
        
        return this.getAttribute("label") || this.querySelector("[slot='label']")?.innerHTML || this.name;
    }

    DOM = {
        main: () => {
            const tag = this.tag;
            const dom = document.createElement(tag);
            dom.classList.add("form-field");
            if (tag === "fieldset") {
                const legend = dom.appendChild(document.createElement("legend"));
                legend.appendChild(this.DOM.label(this.title, this.name));
            } else {
                dom.appendChild(this.DOM.label(this.title, this.name));
            }
            dom.appendChild(document.createElement("slot"));
            return dom;
        },
        style: () => {
            const style = document.createElement("style");
            
            style.textContent = `
            :host {
                display: block;
            }
            `;
            // .form-field {
            //     display: contents;
            // }
            return style;
        },
        label: (content, for_) => {
            const label = document.createElement("label");
            label.setAttribute("for", for_);
            const slot = label.appendChild(document.createElement("slot"));
            slot.setAttribute("name", "label");
            slot.innerHTML = this.label;  
            return label;
        }
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
FormField.init(import.meta);