export default class Utils {
	static pixelRatios = {
		cm: 96 / 2.54,
		mm: 96 / 2.54 / 10,
		q: 96 / 2.54 / 40,
		in: 96,
		pc: 96 / 6,
		pt: 96 / 72,
		px: 1,
	};

	static setStyle(style, obj) {
		for (let propertyName in style) {
			obj.style.setProperty(propertyName, style[propertyName]);
		}
		return this;
	}
	static addStyle(to, ...urls) {
		// Apply external styles <link> inside an element
		urls.forEach(url => {
			const linkElem = document.createElement('link');
			linkElem.setAttribute('rel', 'stylesheet');
			linkElem.setAttribute('href', url);
			to.appendChild(linkElem);
		});
		return this;
	}
	static transferStyles(from, to) {
		for (let key of from.style) {
			if (!key.startsWith('-')) continue;
			to.style.setProperty(key, from.style.getPropertyValue(key));
			from.style.removeProperty(key);
		}
		return this;
	}
	/**
	 * Parses a given value and converts it to a pixel value if necessary.
	 *
	 * @param {string|number} value - The value to be parsed. It can be a string with units or a number.
	 * @param {string} [property='width'] - The CSS property for which the value is being parsed.
	 * @returns {number|string} - The parsed value in pixels or the original value if it cannot be converted.
	 */
	static parseValue(value, property = 'width') {
		const allUnits = {
			absolute: ['cm', 'mm', 'q', 'in', 'pc', 'pt', 'px'],
			font: ['cap', 'rcap', 'em', 'rem', 'ex', 'rex', 'ch', 'rch', 'ic', 'ric', 'lh', 'rlh'],
			viewport: ['vw', 'vh', 'vmin', 'vmax', 'vb', 'lvb', 'dvb', 'vi', 'lvi', 'dvi'],
			containerquery: ['cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax'],
			angle: ['deg', 'grad', 'rad', 'turn'],
			percentage: ['%'],
			time: ['s', 'ms'],
			frequency: ['Hz', 'kHz'],
			resolution: ['dpi', 'dpcm', 'dppx'],
			grid: ['fr'],
		};
		if (typeof value !== 'string') return value;
		// const parts = value.match(/([+-]?)(\d+\.\d+|\d+|\.\d+)([a-zA-Z%]+)?/);
		var [found, sign, number, unit] = value.match(/([+-]?)(\d+\.\d+|\d+|\.\d+)([a-zA-Z%]+)?/);
		sign = (sign === '-') ? -1 : 1;
		number *= sign;
		property = property.replace(/[A-Z]/g, '-$&').toLowerCase();
		if (!unit) {
			if (property === 'line-height') {
				return this.parseValue(`${number}em`);
			}
			return parseFloat(value);
		}
		unit = unit.toLowerCase();
		if (allUnits.absolute.includes(unit)) {
			return this.convertToPx(number, unit);
		}
		if ([...allUnits.font, ...allUnits.viewport].includes(unit)) {
			let dummy = document.body.appendChild(document.createElement('div'));
			dummy.style.position = 'absolute';
			dummy.style.width = found;
			let result = parseFloat(getComputedStyle(dummy).width);
			dummy.remove();
			return result;
		}
		if (allUnits.percentage.includes(unit)) {
			return this.convertPercentageToPx(number, property);
		}
		return value;
	}
	/**
	 * Converts a percentage value to pixels based on the specified property.
	 *
	 * @param {number} value - The percentage value to convert.
	 * @param {string} [property='width'] - The CSS property to base the conversion on. 
	 *                                       Supported properties are 'width', 'height', 'font-size', 'line-height', 
	 *                                       'padding-*', 'margin-*', 'top', 'right', 'bottom', 'left'.
	 * @returns {number|string} - The converted value in pixels or em units, or a percentage string for unsupported properties.
	 */
	static convertPercentageToPx(value, property = 'width', container = document.body) {
		var result = value / 100;
		if (property === 'font-size' || property === 'line-height') {
			return this.parseValue(`${result}em`);
		}
		let box = container.offsetParent.getBoundingClientRect();
		if (property === 'width') {
			return box.width * result;
		}
		if (property === 'height') {
			return box.height * result;
		}
		if (property.startsWith('padding')) {
			console.error('padding percentage not supported yet');
		}
		if (property.startsWith('margin-')) {
			property = property.replace('margin-', '');
			if (property === 'left' || property === 'right') {
				return box.width * result;
			}
			if (property === 'top' || property === 'bottom') {
				return box.height * result;
			}
		}
		if (['top', 'right', 'bottom', 'left'].includes(property)) {
			console.warn('top, right, bottom, left percentage not fully supported yet. Using margin instead');
			return this.parseValue(`${value}%`, 'margin-' + property);
		}
		return result;
	}
	/**
	 * Converts a given value from a specified unit to pixels.
	 *
	 * @param {number} value - The numerical value to be converted.
	 * @param {string} unit - The unit of the value to be converted. 
	 *                        Supported units are: 'cm', 'mm', 'q', 'in', 'pc', 'pt', 'px'.
	 * @returns {number} - The equivalent value in pixels.
	 */
	static convertToPx(value, unit) {
		return value * this.pixelRatios[unit];
	}
	static async loadHTML(url) {
		const htmlString = await fetch(url).then(response => response.text());
		return new DOMParser().parseFromString(htmlString, 'text/html');
	}
}
