import Formponent from "../Formponent.js";

/**
 * Represents the SortableInput
 *  component.
 * @extends Formponent
 */
export default class SortableInput extends Formponent {
    /**
     * The tag name of the SortableInput component.
     * @type {string}
     */
    static tagName = 'si-ponent';

    /**
     * The template file for the SortableInput component. (optional)
     * @type {string}
     */
    // static templateUrl = 'index.tpl';
    static styleUrl = "style.css";

    constructor() {
        super();
        this.newInput = this.querySelector(":not(script)"); // Because of Live server...

        if (this.newInput) {
            // this.newInput.name = this.name + '[new]';
            // this.newInput.id = this.name + "-new";
            this.newInput.remove();
        } else {
            this.newInput = this.DOM.input();
        }
    }

    /**
     * Called when the SortableInput component is connected to the DOM.
     * @override
     */
    connectedCallback() {
        super.connectedCallback();
        this.shadowRoot.appendChild(document.createElement('slot'));

        return;
    }
    static get DOM() {
        return this.prototype.DOM;
    }
    DOM = {
        main: () => {
            const result = document.createElement("ul");
            result.classList.add("sortable");
            result.appendChild(this.DOM.liNew());
            return result;
        },
        li: (txt = "", val = 1) => {
            const result = document.createElement("li");
            result.appendChild(this.DOM.input());
            result.appendChild(this.DOM.btnDelete());
            return result;
        },
        input: () => {
            const result = document.createElement("input");
            result.type = "text";
            result.name = this.name;
            result.id = this.name + "-new";
            return result;
        },
        liNew: () => {
            const result = document.createElement("li");
            const input = result.appendChild(this.newInput.cloneNode(true));
            // const input = result.appendChild(this.DOM.input());

            input.addEventListener("input", (e) => {
                let id = SortableInput.Utils.uniqueId();
                input.name = this.name + "[" + id + "]";
                input.id = this.name + "-" + id;
                input.removeAttribute("placeholder");
                e.target.closest("li").after(this.DOM.liNew());
                e.target.closest("li").querySelector("button").replaceWith(this.DOM.btnDelete());
            }, { once: true });
            result.appendChild(this.DOM.btnAdd());
            return result;
        },
        btnDelete: () => {
            const result = document.createElement("button");
            result.type = "button";
            result.classList.add("delete");
            // result.textContent = "➖︎";
            result.addEventListener("mousemove", (e) => {
                result.classList.remove("add-up", "add-down");
                if (window.keyModifiers | window.MODIFIERS?.SHIFT) {
                    result.classList.add("add-up");
                }
                if (e.ctrlKey) {
                    result.classList.add("add-down");
                }
            });
            result.addEventListener("mouseout", (e) => {
                result.classList.remove("add-up", "add-down");
            });
            result.addEventListener("click", (e) => {
                e.target.closest("li").remove();
            });
            return result;
        },
        btnAdd: () => {
            const result = document.createElement("button");
            result.type = "button";
            result.classList.add("add");
            // result.textContent = "➕︎";
            return result;
        },
    };
    makeRealInput(input) {
        let id = SortableInput.Utils.uniqueId();
        input.name = this.name + "[" + id + "]";
        input.id = this.name + "-" + id;
        input.removeAttribute("placeholder");
        e.target.closest("li").after(this.DOM.liNew());
        e.target.closest("li").querySelector("button").replaceWith(this.DOM.btnDelete());
        return input;
    }
    /**
     * Event handlers for the SortableInput component.
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
     * The observed attributes for the SortableInput component.
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
    static init() {
        super.init(...arguments);
        this.trackKeyModifiers();
    }
}

/**
 * Initializes the SortableInput component.
 */
SortableInput.init(import.meta);