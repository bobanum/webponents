import Component from "../Component.js";

export default class Window extends Component {
    static url = import.meta.url;
    static tagName = 'wp-window';
    static templateUrl = 'index.tpl';
    static styleUrl = 'style.css';
    labels = {
        'ok': 'OK',
        'cancel': 'Cancel',
        'close': 'Close',
        'submit': 'Submit',
        'reset': 'Reset',
    };
    _dom = undefined;
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
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
        this.getTemplate().then(() => {
            this.transferStyles(this, this.dom);
            if (this.hasAttribute('buttons')) {
                const buttons = this.getAttribute('buttons').split(';');
                const domButtons = this.appendChild(document.createElement('footer'));
                domButtons.classList.add('buttons');
                domButtons.slot = 'footer';
                buttons.forEach(button => {
                    const [id, label] = button.split('|');
                    const domButton = domButtons.appendChild(document.createElement('button'));
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
            }
        });
        this.setStyle({});
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
            this._dom = this.shadowRoot.querySelector('.window');
        }
        return this._dom;
    }
    get x() {
        return this.properties.x;
    }
    set x(value) {
        value = this.parseValue(value, "left");
        this.properties.x = parseFloat(value);
        // debugger;
        this.setStyle({
            'left': this.x + 'px',
        });
    }
    get y() {
        return this.properties.y;
    }
    set y(value) {
        this.properties.y = value;
        this.setStyle({
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
        value = this.parseValue(value, "width");
        value = Math.max(this.properties.minWidth, value);
        this.properties.width = value;
        this.setStyle({
            'width': this.width + 'px',
        });
    }
    get height() {
        return this.properties.height;
    }
    set height(value) {
        if (value === undefined) return;
        value = this.parseValue(value, "height");
        value = Math.max(this.properties.minHeight, value);
        this.properties.height = value;
        this.setStyle({
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
        this.setStyle({
            'top': this.properties.y + 'px',
            'height': this.properties.height + 'px',
        });
    }
    get right() {
        return this.properties.x + this.properties.width;
    }
    set right(value) {
        this.width = value - this.properties.x;
        this.setStyle({
            'width': this.properties.width + 'px',
        });
    }
    get bottom() {
        return this.properties.y + this.properties.height;
    }
    set bottom(value) {
        this.height = value - this.properties.y;
        this.setStyle({
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
        this.setStyle({
            'left': this.x + 'px',
            'width': this.width + 'px',
        });
    }
    restore() {
        this.setStyle({
            'top': this.y + 'px',
            'left': this.x + 'px',
            'width': this.width + 'px',
            'height': this.height + 'px',
        });
        this.dom.classList.remove('maximized', 'minimized', 'maximized-y');
    }
    maximize() {
        this.setStyle({
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

    evt = {
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
                // this.dom.classList.add('dragging');
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
                this.setStyle({
                    'height': 'min-content',
                });
                this.dom.classList.remove('maximized');
                this.dom.classList.add('minimized');
            }
        },
    };
    static observableAttributes = {
        'headerless': {
            set: function (value) {
                if (value === 'false' || value === null) {
                    this.dom.classList.remove('headerless');
                    this.dom.removeEventListener('mousedown', this.draggingStart);
                } else {
                    this.dom.classList.add('headerless');
                    this.dom.addEventListener('mousedown', this.draggingStart);
                }
            },
        },
        'footerless': {
            set: function (value) {
                this.dom.classList.toggle('footerless', value !== 'false');
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

Window.init();