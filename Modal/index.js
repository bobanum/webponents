import Utils from "../src/Utils.js";
import Webponent from "../Webponent.js";

export default class Modal extends Webponent {
    static url = import.meta.url;
    static tagName = 'modal-ponent';
    // static templateUrl = 'index.tpl';
    static styleUrl = 'style.css';
    labels = {
        'ok': 'OK',
        'cancel': 'Cancel',
        'close': 'Close',
        'submit': 'Submit',
        'reset': 'Reset',
    };
    properties = {
        'minWidth': 240,
        'minHeight': 180,
        'maxWidth': '100%',
        'maxHeight': '100%',
        'x': 50,
        'y': 100,
        'width': undefined,
        'height': undefined,
    };
    async connectedCallback() {
        let { template } = await super.connectedCallback();
        if (!template) return;
        
        this.shadowRoot.appendChild(template);
        Utils.transferStyles(this, this.dom);
        if (this.hasAttribute('buttons')) {
            const buttons = this.getAttribute('buttons').split(';');
            this.appendChild(this.DOM.buttons(buttons));
        }
        // this.processEvents();
        this._addSlotEvents();
        this.applyAttributes();

        Utils.setStyle({});
        ['x', 'y', 'width', 'height'].forEach(property => {
            this[property] = this.getAttribute(property) || this.properties[property];
        });
        // const observer = new MutationObserver((mutationsList) => {
        //     console.log('Content changed:', mutationsList);
        //     for (let mutation of mutationsList) {
        //         console.log('Content changed:', mutation);
        //         if (mutation.type === 'childList') {
        //         }
        //     }
        // });
        // observer.observe(this, { childList: true, attributes: true, attributeFilter: ['width', 'height', 'x', 'y'] });
        return;
    }
    get dom() {
        if (this._dom === undefined) {
            this._dom = this.shadowRoot.querySelector('.modal');
        }
        return this._dom;
    }
    get x() {
        return this.properties.x;
    }
    set x(value) {
        value = Utils.parseValue(value, "left");
        this.properties.x = parseFloat(value);
        // debugger;
        Utils.setStyle({
            'left': this.x + 'px',
        });
    }
    get y() {
        return this.properties.y;
    }
    set y(value) {
        this.properties.y = value;
        Utils.setStyle({
            'top': this.y + 'px',
        });
    }
    get width() {
        if (this.properties.width === undefined) {
            return this.offsetParent.clientWidth;
        }
        return this.properties.width;
    }
    set width(value) {
        if (value === undefined) return;
        value = Utils.parseValue(value, "width");
        value = Math.max(this.properties.minWidth, value);
        this.properties.width = value;
        Utils.setStyle({
            'width': this.width + 'px',
        });
    }
    get height() {
        return this.properties.height;
    }
    set height(value) {
        if (value === undefined) return;
        value = Utils.parseValue(value, "height");
        value = Math.max(this.properties.minHeight, value);
        this.properties.height = value;
        Utils.setStyle({
            'height': this.height + 'px',
        });
    }
    get top() {
        return this.properties.x;
    }
    set top(value) {
        const height = this.properties.height;
        this.height += this.properties.y - value;
        this.properties.y += height - this.properties.height;
        Utils.setStyle({
            'top': this.properties.y + 'px',
            'height': this.properties.height + 'px',
        });
    }
    get right() {
        return this.properties.x + this.properties.width;
    }
    set right(value) {
        this.width = value - this.properties.x;
        Utils.setStyle({
            'width': this.properties.width + 'px',
        });
    }
    get bottom() {
        return this.properties.y + this.properties.height;
    }
    set bottom(value) {
        this.height = value - this.properties.y;
        Utils.setStyle({
            'height': this.properties.height + 'px',
        });
    }
    get left() {
        return this.properties.x;
    }
    set left(value) {
        const width = this.properties.width;
        this.width += this.properties.x - value;
        this.properties.x += width - this.properties.width;
        Utils.setStyle({
            'left': this.x + 'px',
            'width': this.width + 'px',
        });
    }
    restore() {
        Utils.setStyle({
            'top': this.y + 'px',
            'left': this.x + 'px',
            'width': this.width + 'px',
            'height': this.height + 'px',
        });
        this.dom.classList.remove('maximized', 'minimized', 'maximized-y');
    }
    maximize() {
        Utils.setStyle({
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
        });
        this.dom.classList.remove('minimized', 'maximized-y');
        this.dom.classList.add('maximized');
        return this;
    }
    getMoveListener(callback) {
        return (e) => {
            document.body.addEventListener('mousemove', callback);
            document.body.addEventListener('mouseup', (e) => {
                document.body.style.removeProperty('user-select');
                document.body.removeEventListener('mousemove', callback);
            }, { once: true });
            document.body.style.setProperty('user-select', 'none');
        };
    }
    draggingStart = (e) => {
        const rect = this.getBoundingClientRect();
        const offset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        const mousemove = (e) => {
            if (this.dom.classList.contains('maximized')) {
                this.restore();
                offset.x = this.width / 2;
            } else {
                this.x = e.clientX - offset.x;
                this.y = e.clientY - offset.y;
            }
        };
        document.body.addEventListener('mousemove', mousemove);
        document.body.addEventListener('mouseup', (e) => {
            document.body.style.removeProperty('user-select');
            document.body.removeEventListener('mousemove', mousemove);
        }, { once: true });
        document.body.style.setProperty('user-select', 'none');
    };
    /**
     * Object containing the DOM elements
     */
    DOM = {
        'main': () => {
            const result = document.createDocumentFragment();

            result.appendChild(this.DOM.modal());
            result.appendChild(this.DOM.controls());
            return result;
        },
        'modal': () => {
            const result = document.createElement("template");
            result.classList.add("modal");
            result.appendChild(this.DOM.header());
            result.appendChild(this.DOM.slot_main());
            result.appendChild(this.DOM.slot_footer());
            return result;
        },
        'header': (id) => {
            const result = document.createElement("header");
            result.id = id;
            const title = result.appendChild(document.createElement("span"));
            title.id = "title";
            title.textContent = "Untitled";
            result.appendChild(this.DOM.icons());
            return result;
        },
        'icons': () => {
            const icons = document.createElement("div");
            icons.classList.add("icons");
            icons.appendChild(this.DOM.svg_icon("minimize", "m64 384h384v64h-384z"));
            icons.appendChild(this.DOM.svg_icon("restore", "m128 64v64h256v256h64v-320zm-64 128v256h256v-256zm64 64h128v128h-128z"));
            icons.appendChild(this.DOM.svg_icon("maximize", "m64 64v384h384v-384zm64 64h256v256h-256z"));
            icons.appendChild(this.DOM.svg_icon("close", "m64 64v64l128 128-128 128v64h64l128-128 128 128h64v-64l-128-128 128-128v-64h-64l-128 128-128-128h-64z"));
            const slot = icons.appendChild(document.createElement("slot"));
            slot.name = "icons";
            return icons;
        },
        'svg_icon': (name, d) => {
            const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            icon.setAttribute("width", "24");
            icon.setAttribute("height", "24");
            icon.setAttribute("viewBox", "0 0 512 512");
            icon.classList.add("icon");
            icon.classList.add(name);
            const path = icon.appendChild(document.createElement("path"));
            path.d = d;
            return icon;
        },
        'slot_main': () => {
            const main = document.createElement("div");
            main.classList.add("main");
            main.appendChild(document.createElement("slot"));
            return main;
        },
        'slot_footer': () => {
            const footer = document.createElement("slot");
            footer.name = "footer";
            return footer;
        },
        'controls': () => {
            const controls = document.createElement("div");
            controls.classList.add("controls");
            controls.appendChild(this.DOM.control("nw-resize"));
            controls.appendChild(this.DOM.control("n-resize"));
            controls.appendChild(this.DOM.control("ne-resize"));
            controls.appendChild(this.DOM.control("w-resize"));
            controls.appendChild(this.DOM.control("e-resize"));
            controls.appendChild(this.DOM.control("sw-resize"));
            controls.appendChild(this.DOM.control("s-resize"));
            controls.appendChild(this.DOM.control("se-resize"));
            return controls;
        },
        'control': (name) => {
            const control = document.createElement("div");
            control.classList.add("control");
            control.classList.add(name);
            return control;
        },
        'buttons': (buttons) => {
            const result = document.createElement('footer');
            result.classList.add('buttons');
            result.slot = 'footer';
            buttons.forEach(button => {
                const [id, label] = button.split('|');
                const domButton = result.appendChild(document.createElement('button'));
                domButton.classList.add(button);
                domButton.textContent = label || this.labels[id] || id;
                domButton.id = id;
                if (id === 'submit') {
                    domButton.type = 'submit';
                } else if (id === 'reset') {
                    domButton.type = 'reset';
                }
                domButton.addEventListener('click', (e) => {
                    this.dispatchEvent(new CustomEvent(e.currentTarget.id));
                });
            });
            return result;
        },
    };
    /**
     * Object containing the event listeners
     * @type {Object}
     * Structure: {selector: {event: callback}}
     * selector: CSS selector for the elements to listen to
     * event: Space separated list of event types to listen to
     */
    static EVT = {
        ".n-resize": {
            mousedown: this.getMoveListener((e) => {
                this.top = e.clientY;
            }),
        },
        ".s-resize": {
            mousedown: this.getMoveListener((e) => {
                this.bottom = e.clientY;
            }),
        },
        ".e-resize": {
            mousedown: this.getMoveListener((e) => {
                this.right = e.clientX;
            }),
        },
        ".w-resize": {
            mousedown: this.getMoveListener((e) => {
                this.left = e.clientX;
            }),
        },
        ".nw-resize": {
            mousedown: this.getMoveListener((e) => {
                this.top = e.clientY;
                this.left = e.clientX;
            }),
        },
        ".ne-resize": {
            mousedown: this.getMoveListener((e) => {
                this.top = e.clientY;
                this.right = e.clientX;
            }),
        },
        ".sw-resize": {
            mousedown: this.getMoveListener((e) => {
                this.bottom = e.clientY;
                this.left = e.clientX;
            }),
        },
        ".se-resize": {
            mousedown: this.getMoveListener((e) => {
                this.bottom = e.clientY;
                this.right = e.clientX;
            }),
        },
        "header": {
            dblclick: () => {
                if (this.dom.classList.contains('maximized')) {
                    this.restore();
                } else {
                    this.maximize();
                }
            },
            mousedown: this.draggingStart,
            mousedownzzz: (e) => {
                const rect = this.getBoundingClientRect();
                const offset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                // this.__dom__.classList.add('dragging');
                const mousemove = (e) => {
                    if (this.dom.classList.contains('maximized')) {
                        this.restore();
                        offset.x = this.width / 2;
                    } else {
                        this.x = e.clientX - offset.x;
                        this.y = e.clientY - offset.y;
                    }
                };
                document.body.addEventListener('mousemove', mousemove);
                document.body.addEventListener('mouseup', (e) => {
                    document.body.style.removeProperty('user-select');
                    document.body.removeEventListener('mousemove', mousemove);
                }, { once: true });
                document.body.style.setProperty('user-select', 'none');
            },
        },
        ".close": {
            click: () => {
                const event = new CustomEvent("close");
                this.dispatchEvent(event);
                this.remove();
            }
        },
        // "#btn_ok": {
        //     click: () => {
        //         this.dispatchEvent(new CustomEvent('ok'));
        //         this.remove();
        //     }
        // },
        // "#btn_cancel": {
        //     click: () => {
        //         this.dispatchEvent(new CustomEvent('cancel'));
        //         this.remove();
        //     }
        // },
        ".maximize": {
            mousedown: (e) => {
                e.stopPropagation();
            },
            click: () => {
                this.maximize();
            }
        },
        ".restore": {
            mousedown: (e) => {
                e.stopPropagation();
            },
            click: () => {
                this.restore();
            }
        },
        ".minimize": {
            mousedown: (e) => {
                e.stopPropagation();
            },
            click: () => {
                if (this.dom.classList.contains('maximized')) {
                    this.restore();
                }
                Utils.setStyle({
                    'height': 'min-content',
                });
                this.dom.classList.remove('maximized');
                this.dom.classList.add('minimized');
            }
        },
    };
    static observedProps = {
        'headerless': {
            set: function (value) {
                if (value === 'false' || value === null) {
                    this.__dom__.classList.remove('headerless');
                    this.__dom__.removeEventListener('mousedown', this.draggingStart);
                } else {
                    this.__dom__.classList.add('headerless');
                    this.__dom__.addEventListener('mousedown', this.draggingStart);
                }
            },
        },
        'footerless': {
            set: function (value) {
                this.__dom__.classList.toggle('footerless', value !== 'false');
            },
        },
        'title': {
            set: function (value) {
                this.shadowRoot.querySelector('#title').textContent = value;
                this.removeAttribute('title');
            },
            remove: function () {
                // Title removed: do nothing
            },
        },
        'x': {
            set: function (value) {
                this.properties.x = value;
            },
        },
        'y': {
            set: function (value) {
                this.properties.y = value;
            },
        },
        'width': {
            set: function (value) {
                this.properties.width = value;
            },
        },
        'height': {
            set: function (value) {
                this.properties.height = value;
            },
        },
    };

}
Modal.init(import.meta);