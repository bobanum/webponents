import Webponent from '../Webponent.js';
/**
 * Represents a custom file upload element.
 * @class
 * @extends Webponent
 */
class Upload extends Webponent {
	/**
	 * The tag name of the custom element.
	 * @type {string}
	 */
	static tagName = 'web-upload';
	/**
	 * Indicates whether the class is associated with a form element.
	 * @type {boolean}
	 */
	static formAssociated = true;
	/**
	 * An array of attribute names to be observed for changes.
	 * @type {string[]}
	 * @static
	 */
	static observedAttributes = ['accept', 'multiple'];
	/**
	 * Constructor for the Upload class.
	 * @constructor
	 */
	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this.attachShadow({ mode: 'open' });
		this.internals_.role = 'upload';

		if (this.hasAttribute('accept')) {
			this.accept = this.getAttribute('accept');
		}
		this.multiple = this.hasAttribute('multiple');
	}
	get api() {
		if (this.hasAttribute('api')) {
			return this.getAttribute('api');
		}
		if (this.hasAttribute('formaction')) {
			return this.getAttribute('formaction');
		}
		if (this.form?.hasAttribute('action')) {
			return this.form.getAttribute('action');
		}
		return 'api';
	}
	get form() {
		return this.internals_.form;
	}
	connectedCallback() {
		this.shadowRoot.appendChild(this.dom.style());
		this.shadowRoot.appendChild(this.dom.drop_area());
	}
	addEventListeners(events, ...elements) {
		elements.forEach(element => {
			for (let k in events) {
				const eventNames = k.split('|');
				const fn = events[k];
				eventNames.forEach(eventName => {
					element.addEventListener(eventName, fn, false);
				});
			}
		});
	}

	handleFiles(files) {
		return this.upload(files).catch((error) => {
			console.error('Error uploading file:', error);
		}).then((response) => {
			// console.log('File uploaded:', response);
			return response;
		});
	}

	upload(files) {
		const url = this.api;
		const name = this.name || 'file';
		const formData = new FormData();
		if (this.multiple) {
			[...files].forEach((file, i) => {
				formData.append(`${name}_${i}`, file);
			});
		} else {
			formData.append(name, files[0]);
		}
		const options = {
			method: 'POST',
			body: formData
		};
	
		return fetch(url, options)
			.catch(error => {
				console.error('Error uploading file:', error);
				return false;
			}).then(response => {
				return response.json();
			});
	}

	dom = {
		style: () => {
			const style = document.createElement('style');
			style.textContent = `:host {
				display: block;
			}
			.drop-area {
				background-color: #f9f9f9;
				border: 2px dashed #ccc;
				border-radius: 10px;
				width: 100%;
				height: 100%;
				text-align: center;
				font-size: 20px;
				color: #333;
				margin: 50px auto;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.drop-area.hover {
				border-color: #333;
				background-color: #f0f0f0;
			}
			.file-input {
				display: none;
			}`;
			return style;
		},
		drop_area: () => {
			const dropArea = document.createElement('div');
			dropArea.classList.add('drop-area');
			const slot = dropArea.appendChild(document.createElement('slot'));
			slot.textContent = 'Drag & Drop Files Here';
			const fileInput = dropArea.appendChild(this.dom.file_input());
			this.addEventListeners(this.evt.dropArea, dropArea);

			return dropArea;
		},
		file_input: () => {
			const fileInput = document.createElement('input');
			fileInput.classList.add('file-input');
			fileInput.type = 'file';
			fileInput.multiple = this.multiple;
			fileInput.name = this.name;
			fileInput.accept = this.accept;

			this.addEventListeners(this.evt.fileInput, fileInput);

			return fileInput;
		},
	};
	evt = {
		dropArea: {
			'dragenter|dragover|dragleave|drop': (e) => {
				e.preventDefault();
				e.stopPropagation();
			},
			'dragenter|dragover': (e) => {
				e.currentTarget.classList.add('hover');
			},
			'drop': (e) => {
				// TODO - Check accepted files
				const dt = e.dataTransfer;
				const files = dt.files;
				this.handleFiles(files).then((response) => {
					// Send event
					const event = new CustomEvent('upload', {
						detail: response,
						bubbles: true,
						cancelable: true,
					});
					this.dispatchEvent(event);
				});
			},
			'dragleave|drop': (e) => {
				e.currentTarget.classList.remove('hover');
			},
			click: () => {
				fetch('http://localhost:8888/api.php').then(response => {
					return response;
				}).catch(error => {
					console.error('Error uploading file:', error);
				});
				// fileInput.click();
			}
		},
		// Handle file selection via file input
		fileInput: {
			change: (e) => {
				const files = e.target.files;
				this.handleFiles(files);
			},
		}

	};
}
Upload.init(import.meta);
