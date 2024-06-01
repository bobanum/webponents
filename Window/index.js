import Component from "../Component.js";

export default class Window extends Component {
    static url = import.meta.url;
    static tagName = 'wp-window';
    static icons = {
        close: `m64 64v64l128 128-128 128v64h64l128-128 128 128h64v-64l-128-128 128-128v-64h-64l-128 128-128-128h-64z`,
        maximize: `m64 64v384h384v-384zm64 64h256v256h-256z`,
        restore: `m128 64v64h256v256h64v-320zm-64 128v256h256v-256zm64 64h128v128h-128z`,
        minimize: `m64 384h384v64h-384z`,
        resize: `m512 0-512 512h128l384-384zm0 192-320 320h128l192-192zm0 192-128 128h128z`,
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
    constructor() {
        super();
        this.shadow.appendChild(this.constructor.dom_controls());
        this.transferStyles(this, this.dom);
        this.setStyle({
            'position': 'fixed',
            'z-index': '2000',
            'display': 'grid',
        });
        ['x', 'y', 'width', 'height'].forEach(property => {
            this[property] = this.getAttribute(property) || this.properties[property];
        });
        this.addEvents();
        const observer = new MutationObserver((mutationsList) => {
            console.log('Content changed:', mutationsList);
            for (let mutation of mutationsList) {
                console.log('Content changed:', mutation);
                if (mutation.type === 'childList') {
                }
            }
        });
        observer.observe(this, { childList: true, attributes: true, attributeFilter: ['width', 'height', 'x', 'y'] });
        this.addEventListener('click', (e) => {
            this.querySelector('slot').textContent = 'Héros';
        });

    }
    get x() {
        return this.properties.x;
    }
    set x(value) {
        value = this.parseValue(value, "left");
        this.properties.x = parseFloat(value);
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
    transferStyles(from, to) {
        for (let key of from.style) {
            to.style.setProperty(key, from.style.getPropertyValue(key));
        }
        from.removeAttribute('style');
        for (let c of from.classList) {
            to.classList.add(c);
        }
        return this;
    }

    static domCreate() {
        const result = document.createElement('div');
        result.classList.add('window');
        const header = result.appendChild(document.createElement('header'));
        const slot = header.appendChild(document.createElement('slot'));
        slot.name = 'title';
        slot.textContent = 'Héros';
        header.appendChild(this.dom_icons());
        const main = result.appendChild(document.createElement('div'));
        main.classList.add('main');
        main.appendChild(document.createElement('slot'));
        const footer = result.appendChild(document.createElement('footer'));
        footer.appendChild(document.createElement('button')).textContent = 'OK';
        footer.appendChild(document.createElement('button')).textContent = 'Cancel';
        const resize = result.appendChild(this.dom_icon('resize'));
        return result;
    }
    static dom_icons() {
        const result = document.createElement('div');
        result.classList.add('icons');
        result.appendChild(this.dom_icon('minimize'));
        result.appendChild(this.dom_icon('restore'));
        result.appendChild(this.dom_icon('maximize'));
        result.appendChild(this.dom_icon('close'));
        return result;
    }
    static dom_controls() {
        const result = document.createElement('div');
        result.classList.add('controls');
        const controls = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'];
        controls.forEach(control => {
            let div = result.appendChild(document.createElement('div'));
            div.classList.add('control', control);
        });
        return result;
    }
    static dom_icon(icon, callback) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 512 512');
        const path = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        path.setAttribute('d', this.icons[icon]);
        svg.classList.add('icon', icon);
        if (callback) {
            svg.addEventListener('click', callback);
        }
        return svg;
    }

    static dom_button(className, href) {
        const button = document.createElement('button');
        button.classList.add(className);
        const svg = button.appendChild(this.dom_svg());
        const use = svg.appendChild(document.createElement('use'));
        use.setAttribute('href', href);
        return button;
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
            mousedown: (e) => {
                const rect = this.getBoundingClientRect();
                const offset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                this.dom.classList.add('dragging');
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
                this.remove();
            }
        },
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
}

Window.init();