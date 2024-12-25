import Webponent from "../Webponent.js";
import Utils from "../src/Utils.js";
export default class Dialog extends Webponent {
    // static tagName = 'dialog-ponent';
    static _styleUrl = 'dialog.css';
    properties = {
        'minWidth': 140,
        'minHeight': 180,
        'maxWidth': '100%',
        'maxHeight': '100%',
        'x': 20,
        'y': 100,
        'width': undefined,
        'height': undefined,
    };
    static icons = {
        minimize: "m64 384h384v64h-384z",
        restore: "m128 64v64h256v256h64v-320zm-64 128v256h256v-256zm64 64h128v128h-128z",
        maximize: "m64 64v384h384v-384zm64 64h256v256h-256z",
        close: "m64 64v64l128 128-128 128v64h64l128-128 128 128h64v-64l-128-128 128-128v-64h-64l-128 128-128-128h-64z",
    };
    connectedCallback() {
        super.connectedCallback();
        console.log('Dialog constructor', this.constructor, super.constructor);
        
        this.style.left = this.properties.x + 'px';
        this.style.top = this.properties.y + 'px';
        if (this.properties.minWidth) {
            this.style.minWidth = this.properties.minWidth + 'px';
        }
        if (this.properties.minHeight) {
            this.style.minHeight = this.properties.minHeight + 'px';
        }
        return;
    }
    get x() {
        return this.properties.x;
    }
    set x(value) {
        value = Utils.parseValue(value, "left");
        this.properties.x = parseFloat(value);
        Utils.setStyle({
            'left': this.x + 'px',
        }, this);
    }
    get y() {
        return this.properties.y;
    }
    set y(value) {
        this.properties.y = value;
        Utils.setStyle({
            'top': this.y + 'px',
        }, this);
    }
    get width() {
        if (this.properties.width === undefined) {
            this.properties.width = this.offsetWidth;
        }
        return this.properties.width;
    }
    set width(value) {
        if (value === undefined) return;
        value = Utils.parseValue(value, "width");
        value = value;
        this.properties.width = value;
        Utils.setStyle({
            'width': this.width + 'px',
        }, this);
    }
    get height() {
        if (this.properties.height === undefined) {
            this.properties.height = this.offsetHeight;
        }
        return this.properties.height;
    }
    set height(value) {
        if (value === undefined) return;
        value = Utils.parseValue(value, "height");
        value = value;
        this.properties.height = value;
        Utils.setStyle({
            'height': this.height + 'px',
        }, this);
    }
    get top() {
        return this.properties.x;
    }
    set top(value) {
        const diff = this.properties.y - value;
        if (diff === 0) return;
        if (this.properties.minHeight && diff < 0 && this.height + diff <= this.properties.minHeight) return;

        this.height += diff;
        this.y = value;
    }
    get right() {
        return this.properties.x + this.properties.width;
    }
    set right(value) {
        this.width = value - this.properties.x;
        Utils.setStyle({
            'width': this.properties.width + 'px',
        }, this);
    }
    get bottom() {
        return this.properties.y + this.properties.height;
    }
    set bottom(value) {
        this.height = value - this.properties.y;
        Utils.setStyle({
            'height': this.properties.height + 'px',
        }, this);
    }
    get left() {
        return this.properties.x;
    }
    set left(value) {
        const diff = this.properties.x - value;
        if (diff === 0) return;
        if (this.properties.minWidth && diff < 0 && this.width + diff <= this.properties.minWidth) return;
        this.width += diff;
        this.x = value;
        return;
    }
    setStyle(styles) {
        Utils.setStyle(styles, this);
        return this;
    }
    restore() {
        // Utils.setStyle({
        //     'top': this.y + 'px',
        //     'left': this.x + 'px',
        //     'width': this.width + 'px',
        //     'height': this.height + 'px',
        // }, this);
        this.removeAttribute('maximized');
        this.removeAttribute('minimized');
        this.removeAttribute('minimized-y');
        return this;
    }
    maximize() {
        Utils.setStyle({
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
        }, this);
        this.removeAttribute('minimized');
        this.removeAttribute('minimized-y');
        this.setAttribute('maximized', '');
        return this;
    }
    getMoveListener(callback) {
        return (e) => {
            let p = e.target.offsetParent;
            p.addEventListener('mousemove', callback);
            p.addEventListener('mouseup', (e) => {
                p.style.removeProperty('user-select');
                p.removeEventListener('mousemove', callback);
            }, { once: true });
            p.style.setProperty('user-select', 'none');
        };
    }
    draggingStart = (e) => {
        if (e.target.classList.contains('icon')) return;
        const rect = this.getBoundingClientRect();

        const offset = {
            x: e.layerX,
            y: e.layerY,
        };
        this.style.pointerEvents = 'none';
        this.offsetParent.style.userSelect = 'none';
        this.offsetParent.style.cursor = 'grabbing';

        const mousemove = (e) => {
            if (this.hasAttribute('maximized')) {
                this.restore();
                offset.x = this.width / 2;
            } else {
                this.x = e.layerX - offset.x;
                this.y = e.layerY - offset.y;
            }
        };
        const draggingStop = (e) => {
            this.style.removeProperty('pointer-events');
            this.offsetParent.style.removeProperty('user-select');
            this.offsetParent.style.removeProperty('cursor');
            this.offsetParent.removeEventListener('mousemove', mousemove);
        };
        this.offsetParent.addEventListener('mousemove', mousemove);
        this.offsetParent.addEventListener('mouseup', (e) => {
            draggingStop(e);
        }, { once: true });
        this.offsetParent.addEventListener('mouseleave', (e) => {
            draggingStop(e);
        }, { once: true });
    };
    static DOM = {
        main: () => {
            console.log(this.DOM);
            
            let result = document.createDocumentFragment();
            result.appendChild(this.DOM.header());
            result.appendChild(this.DOM.content());
            result.appendChild(this.DOM.footer());
            result.appendChild(this.DOM.controls());
            return result;
        },
        header: () => {
            let result = document.createElement('header');
            result.appendChild(this.DOM.title());
            result.appendChild(this.DOM.icons());
            this.addEventListeners(this.evt.header, result);
            return result;
        },
        title: () => {
            let result = document.createElement('span');
            result.id = 'title';
            result.textContent = 'Untitled';
            return result;
        },
        icons: () => {
            let result = document.createElement('div');
            result.classList.add('icons');
            result.appendChild(this.DOM.icon('minimize'));
            result.appendChild(this.DOM.icon('restore'));
            result.appendChild(this.DOM.icon('maximize'));
            result.appendChild(this.DOM.icon('close'));
            return result;
        },
        icon: (name) => {
            let result = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            result.classList.add('icon', name);
            result.setAttribute('viewBox', '0 0 512 512');
            result.innerHTML = `<path d="${this.icons[name]}"></path>`;
            this.addEventListeners(this.evt[name], result);
            return result;
        },
        content: () => {
            let result = document.createElement('main');
            result.appendChild(document.createElement('slot'));
            return result;
        },
        footer: () => {
            let result = document.createElement('footer');
            result.appendChild(this.DOM.button('btn_ok', 'OK', this.evt.btn_ok));
            result.appendChild(this.DOM.button('btn_cancel', 'Cancel', this.evt.btn_cancel));
            return result;
        },
        button: (id, text, evts = {}) => {
            let result = document.createElement('button');
            result.id = id;
            result.textContent = text;
            this.addEventListeners(evts, result);
            return result;
        },
        controls: () => {
            let result = document.createElement('div');
            result.classList.add('controls');
            ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].forEach(name => {
                name += '-resize';
                let div = document.createElement('div');
                div.classList.add('control', name);
                this.addEventListeners(this.evt[name], div);
                result.appendChild(div);
            });
            return result;
        }
    };
    getCoords(e) {
        return [e.clientX - this.offsetParent.offsetLeft, e.clientY - this.offsetParent.offsetTop];
    }
    static EVT = {
        "n-resize": {
            mousedown: this.getMoveListener((e) => {
                this.top = this.getCoords(e)[1];
            }),
        },
        "s-resize": {
            mousedown: this.getMoveListener((e) => {
                this.bottom = this.getCoords(e)[1];
            }),
        },
        "e-resize": {
            mousedown: this.getMoveListener((e) => {
                this.right = this.getCoords(e)[0];
            }),
        },
        "w-resize": {
            mousedown: this.getMoveListener((e) => {
                this.left = this.getCoords(e)[0];
            }),
        },
        "nw-resize": {
            mousedown: this.getMoveListener((e) => {
                [this.left, this.top] = this.getCoords(e);
            }),
        },
        "ne-resize": {
            mousedown: this.getMoveListener((e) => {
                [this.right, this.top] = this.getCoords(e);
            }),
        },
        "sw-resize": {
            mousedown: this.getMoveListener((e) => {
                [this.left, this.bottom] = this.getCoords(e);
            }),
        },
        "se-resize": {
            mousedown: this.getMoveListener((e) => {
                [this.right, this.bottom] = this.getCoords(e);
            }),
        },
        "header": {
            dblclick: () => {
                if (this.hasAttribute('maximized')) {
                    this.restore();
                } else {
                    this.maximize();
                }
            },
            mousedown: this.draggingStart,
        },
        "close": {
            click: () => {
                const event = new CustomEvent("close");
                this.dispatchEvent(event);
                this.remove();
            }
        },
        "btn_ok": {
            click: () => {
                this.dispatchEvent(new CustomEvent('ok'));
                this.remove();
            }
        },
        "btn_cancel": {
            click: () => {
                this.dispatchEvent(new CustomEvent('cancel'));
                this.remove();
            }
        },
        "maximize": {
            mousedown: (e) => {
                e.stopPropagation();
            },
            click: () => {
                this.maximize();
            }
        },
        "restore": {
            mousedown: (e) => {
                e.stopPropagation();
            },
            click: () => {
                this.restore();
            }
        },
        "minimize": {
            mousedown: (e) => {
                e.stopPropagation();
            },
            click: () => {
                if (this.hasAttribute('maximized')) {
                    this.restore();
                }
                // Utils.setStyle({
                //     'height': 'min-content',
                // }, this);
                // this.removeAttribute('maximized');
                this.setAttribute('minimized', '');
            }
        },
    };
    static observableAttributes = {
        'headerless': {
            set: function (value) {
                if (value === 'false' || value === null) {
                    this.removeAttribute('headerless');
                    this.removeEventListener('mousedown', this.draggingStart);
                } else {
                    this.setAttribute('headerless', '');
                    this.addEventListener('mousedown', this.draggingStart);
                }
            },
        },
        'footerless': {
            set: function (value) {
                if (value === 'false' || value === null) {
                    this.removeAttribute('footerless');
                } else {
                    this.setAttribute('footerless', '');
                }
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

Dialog.init(import.meta);
