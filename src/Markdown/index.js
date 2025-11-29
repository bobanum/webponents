import Webponent from "../Webponent.js";

/**
 * Represents the Markdown component.
 * @extends Webponent
 */
export default class Markdown extends Webponent {
    /**
     * The tag name of the Markdown component.
     * @type {string}
     */
    static tagName = 'markdown-ponent';

    /**
     * The template file for the Markdown component. (optional)
     * @type {string}
     */
    // static templateUrl = 'index.tpl';
    // static styleUrl = "style.css";

    constructor() {
        super();
    }

    /**
     * Called when the Markdown component is connected to the DOM.
     * @override
     */
    connectedCallback() {
        super.connectedCallback();
        this.getMarked().then(() => {
            var markdown = this.innerHTML.split(/\r\n|\n\r|\r|\n/);
            while (markdown[0].length === 0) markdown.shift();
            while (markdown[markdown.length - 1].length === 0) markdown.pop();
            var espaces = markdown.map((line) => {
                if (line.length === 0) return null;
                return /^\s*/.exec(line)[0].length;
            });
            var min = Math.min(...espaces);
            markdown = markdown.map((line) => line.substring(min));
            markdown = markdown.join('\n');

            var html = this.marked.parse(markdown);
            this.shadowRoot.innerHTML = html;
            return;
        });
        // this.getShowdown().then(() => {
        //     return;
        //     var converter = new showdown.Converter();
        //     var markdown = this.innerHTML
        //         .trim()
        //         .replace(/^<!(--)?\[CDATA\[/, '')
        //         .replace(/]](--)?>$/, '')
        //         .trim();
        //     console.log(markdown);

        //     var html = converter.makeHtml(markdown);
        //     this.shadowRoot.innerHTML = html;
        //     return;
        // });
        return;
    }

    /**
     * Event handlers for the Markdown component.
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
     * The observed attributes for the Markdown component.
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
    async getMarked() {
        return this.marked || this._marked_.then((module) => {
            console.log(module);

            this.marked = window.marked;
            return this.marked;
        });
    }
    async getShowdown() {
        return this.showdown || this._showdown_.then((module) => {
            this.showdown = window.showdown;
            return this.showdown;
        });
    }
    static init(meta) {
        super.init(meta);
        // this.prototype._showdown_ = this.loadScript('showdown/dist/showdown.min.js');
        this.prototype._marked_ = this.loadScript('https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js');
    }
}

/**
 * Initializes the Markdown component.
 */
Markdown.init(import.meta);