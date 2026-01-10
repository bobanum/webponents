import Webponent from "../Webponent.js";

/**
 * Title component that renders heading elements (h1-h6) with dynamic level cycling.
 * Extends the Webponent base class to create a custom web component for semantic heading markup.
 * Click the component to cycle through heading levels (h1 → h2 → h3 → h4 → h5 → h6 → h1).
 * 
 * Registered as: 'title-ponent'
 * 
 * @class Title
 * @extends {Webponent}
 * 
 * @example
 * // Basic usage in HTML
 * <title-ponent level="2">My Heading</title-ponent>
 * 
 * @example
 * // Programmatic creation
 * const title = document.createElement('title-ponent');
 * title.level = 3;
 * title.textContent = 'Dynamic Heading';
 * document.body.appendChild(title);
 * 
 * @example
 * // Interactive behavior
 * const title = document.querySelector('title-ponent');
 * title.addEventListener('click', () => {
 *   console.log('New level:', title.level);
 * });
 */
export class Title extends Webponent {
	/**
	 * Web Components lifecycle hook called when the element is inserted into the DOM.
	 * Performs initial rendering and sets up interactive behavior.
	 * 
	 * @override
	 */
	connectedCallback() {
		this.render();
	}
	
	/**
	 * Renders or updates the heading element in the shadow DOM.
	 * Creates a new heading element (h1-h6) based on the current level property,
	 * and replaces the previous element if it exists, or appends it as the first render.
	 * 
	 * @returns {HTMLElement} The newly created and rendered heading element
	 * 
	 * @example
	 * // Manually trigger a re-render
	 * this.render();
	 */
	render() {
		const old = this.rendered;
		this.rendered = this.dom.main();
		if (old) {
			old.replaceWith(this.rendered);
		} else {
			this.shadowRoot.appendChild(this.rendered);
		}
		return this.rendered;
	}
	
	/**
	 * DOM element factory object containing methods for creating component elements.
	 * Follows a factory pattern to centralize element creation logic.
	 * 
	 * @type {Object}
	 * @property {Function} main - Creates the main heading element with a slot for content
	 */
	dom = {
		main: () => {
			const result = document.createElement('h' + this.level);
			result.appendChild(document.createElement('slot'));
			return result;
		}
	};
	
	/**
	 * Reactive property definitions for the Title component.
	 * Properties automatically sync with HTML attributes and trigger re-renders when changed.
	 * 
	 * @type {Object}
	 * @static
	 */
	static properties = {
		/**
		 * Heading level that determines which h-tag (h1-h6) to render.
		 * Automatically cycles values to stay within the valid range (1-6).
		 * Setting level triggers a re-render of the component.
		 * 
		 * @type {Object}
		 * @property {Function} type - Number type for automatic coercion
		 * @property {number} default - Default level value of 1 (h1)
		 * @property {Function} assert - Validates and cycles the value to 1-6 range
		 * @property {Function} set - Re-renders the component when level changes
		 * 
		 * @example
		 * title.level = 3;  // Renders as <h3>
		 * title.level = 7;  // Cycles to 1, renders as <h1>
		 * title.level = 0;  // Cycles to 6, renders as <h6>
		 */
		level: {
			type: Number,
			default: 1,
			assert(value) {
				value = Number(value);
				if (isNaN(value)) return undefined;
				return this.cycle(value);
			},
			set(value) {
				if (this.rendered) {
					this.render();
				} 
			}
		}
	};
	
	/**
	 * Utility method to cycle a numeric value within a specified range using modulo arithmetic.
	 * Values outside the range wrap around to stay within [min, max] inclusive.
	 * 
	 * @param {number} num - The number to cycle
	 * @param {number} [min=1] - The minimum value of the range (inclusive)
	 * @param {number} [max=6] - The maximum value of the range (inclusive)
	 * @returns {number} The cycled value within the specified range
	 * 
	 * @example
	 * cycle(3);        // Returns: 3 (within range)
	 * cycle(7);        // Returns: 1 (wraps to start)
	 * cycle(0);        // Returns: 6 (wraps to end)
	 * cycle(-1);       // Returns: 5 (wraps from below)
	 * cycle(10, 1, 3); // Returns: 1 (cycles within 1-3)
	 */
	cycle(num, min = 1, max = 6) {
		const range = max - min + 1;
		const positive = (num - min) % range + range;
		return positive % range + min;
	}
}

/**
 * Automatically register the Title component as 'title-ponent' custom element.
 * This makes the component immediately available for use in HTML.
 */
Title.register("title");
export default Title;