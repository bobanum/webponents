import Webponent from "./Webponent.js";
import Utils from "./src/Utils.js";

/**
 * Formponent is a custom HTML element that extends HTMLElement.
 * It provides a base structure for creating web components with various utility methods
 * for handling styles, events, attributes, and templates.
 *
 * @class Formponent
 * @extends Webponent
 */
export default class Formponent extends Webponent {
	/**
	 * Event object.
	 * @type {Object}
	 */
	static EVT = {};

	/**
	 * Represents a component.
	 * @constructor
	 */
	constructor() {
		super();
		this.internals_ = this.attachInternals();
	}
	get name() {
		return this.getAttribute("name");
	}
	get form() {
		return this.internals_.form;
	}
}
