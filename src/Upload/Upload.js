import Component from '../Component.js';
/**
 * Represents a custom file upload element.
 * @class
 * @extends Component
 */
class Upload extends Component {
	/**
	 * Indicates whether the class is associated with a form element.
	 * @type {boolean}
	 */
	static formAssociated = true;
	/**
	 * Constructor for the Upload class.
	 * @constructor
	 */
	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this.internals_.role = 'upload';
		this.fileInput = document.createElement('input');
	}
	static properties = {
		accept: this.createProperty('accept', {
			set(value) {
				this.fileInput.accept = value;
			}
		}),
		multiple: this.createProperty('multiple', {
			set(value) {
				this.fileInput.multiple = (value === '') || value;
			}
		}),
		name: this.createProperty('name', {
			set(value) {
				this.fileInput.name = value;
			}
		})
	};
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

	static async handleFiles(files, url) {
		let response;
		try {
			response = await this.upload(files, url);
		} catch (error) {
			console.error('Error uploading file:', error);
			const response = undefined;
		}
		return response;
	}

	static async upload(files, url) {
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

		let response;
		try {
			response = await fetch(url, options);
		} catch (error) {
			console.error('Error uploading file:', error);
			response = false;
		}
		return response.json();
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
			.input {
				display: none;
			}`;
			return style;
		},
		drop_area: () => {
			const dropArea = document.createElement('label');
			dropArea.htmlFor = `input`;
			dropArea.classList.add('drop-area');
			const slot = dropArea.appendChild(document.createElement('slot'));
			slot.textContent = 'Drag & Drop Files Here';
			dropArea.appendChild(this.dom.file_input());
			this.addEventListeners(this.evt.dropArea, dropArea);

			return dropArea;
		},
		file_input: () => {
			const fileInput = this.fileInput;
			fileInput.type = 'file';
			fileInput.id = `input`;
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
				console.log(e.type);
				e.currentTarget.classList.add('hover');
			},
			'drop': (e) => {
				// TODO - Check accepted files
				console.log(e.type);
				const dt = e.dataTransfer;
				const files = dt.files;
				this.fileInput.files = files;
				const event = new CustomEvent('change', {
					detail: files,
					bubbles: true,
					cancelable: true,
				});
				console.log(event);
				this.dispatchEvent(event);
				// this.handleFiles(files).then((response) => {
				// 	// Send event
				// 	const event = new CustomEvent('upload', {
				// 		detail: response,
				// 		bubbles: true,
				// 		cancelable: true,
				// 	});
				// 	this.dispatchEvent(event);
				// });
			},
			'dragleave|drop': (e) => {
				console.log(e.type);
				e.currentTarget.classList.remove('hover');
			}
		},
		// Handle file selection via file input
		fileInput: {
			change: (e) => {
				console.log(e.type);
				
				const files = e.target.files;
				// this.static handleFiles(files);
			},
		}

	};
}
Upload.register();
