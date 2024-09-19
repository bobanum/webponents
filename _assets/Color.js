
export default class Color {
    constructor(r = 0, g = 0, b = 0) {
        this.setRGB(r, g, b);
    }
    setRGB(r = 0, g = 0, b = 0) {
        this._ = { r, g, b };
    }
    setHSL(h = 0, s = 0, l = 0) {
        this._ = { h, s, l };
    }
    static rgb2hsl(r, g, b) {
        // r = r / 255;
        // g = r / 255;
        // b = r / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;
        let s;
        let l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    static hsl2rgb(h, s, l) {
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = this.hueToRgb(p, q, h / 360 + 1 / 3);
            g = this.hueToRgb(p, q, h / 360);
            b = this.hueToRgb(p, q, h / 360 - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    static fromHex(hex) {
        hex = hex.replace(/^#/, "").toUpperCase();
        hex = hex;

        if (hex.length === 3 || hex.length === 4) {
            hex = hex.split("").map(d => d + d).join();
        }
        console.log(hex);
        
        let r = parseInt(hex.slice(0,2), 16);
        let g = parseInt(hex.slice(2,4), 16);
        let b = parseInt(hex.slice(4,6), 16);
        return new this(r, g, b);
    }
    static main(colors) {
        for (let name in colors) {
            console.log(colors[name].hex);
            console.log(this.fromHex(colors[name].hex));
            break;
        }
    }
}
