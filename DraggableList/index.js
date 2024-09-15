// TEST. Not usable 
class Draggable extends HTMLElement {
	constructor() {
		super();
		this.style.display = "block";
		this.trigger = null;
		if (this.hasAttribute("trigger")) {
			this.trigger = this.getAttribute("trigger");
		}
		const shadow = this.attachShadow({ mode: 'open' });
		this.container = shadow.appendChild(document.createElement('ul'));
		this.container.classList.add('container');
		shadow.appendChild(this.styleTag());
		while (this.firstElementChild) {
			let item = this.container.appendChild(document.createElement('li'));
			item.appendChild(this.firstElementChild);
		}
		this.load(shadow);
	}
	addPlaceholder(e) {
		const dragging = e.target.closest(":host > ul > li");
		var placeholder = document.createElement('li');
		placeholder.classList.add('placeholder');
		placeholder.style.height = dragging.offsetHeight + 'px';
		placeholder.offset = dragging.getBoundingClientRect().top - e.clientY;
		dragging.style.top = dragging.offsetTop + 'px';
		dragging.classList.add('dragging');
		dragging.parentNode.insertBefore(placeholder, dragging);
		placeholder.original = dragging;
		this.placeholder = placeholder;
	}
	evt = {
		mousedown: (e) => {
			if (e.target.parentNode === e.currentTarget || e.target.matches(this.trigger)) {
				this.addPlaceholder(e);
				document.addEventListener('mousemove', this.evt.mousemove);
				document.addEventListener('mouseup', this.evt.mouseup, { once: true });
			}
		},
		mousemove: (e) => {
			var top = e.clientY - this.placeholder.original.offsetParent.getBoundingClientRect().top + this.placeholder.offset;
			var max = this.placeholder.original.offsetParent.offsetHeight - this.placeholder.original.offsetHeight - 1;
			this.placeholder.original.style.top = Math.min(max,Math.max(0,top)) + 'px';
			this.movePlaceholder();
		},
		mouseup: () => {
			this.placeholder.original.classList.remove('dragging');
			this.placeholder.original.style.removeProperty('top');
			document.removeEventListener('mousemove', this.evt.mousemove);
			this.container.insertBefore(this.placeholder.original, this.placeholder);
			this.placeholder.remove();
			this.placeholder.original = null;
		},
		keydown: (e) => {
			if (e.target.type !== "text") return;
			var keyCode = e.keyCode || e.which;
			var isPrintable = (keyCode > 47 && keyCode < 58) || // Numeric keys
				(keyCode > 64 && keyCode < 91) || // Alphabet keys
				(keyCode > 95 && keyCode < 112) || // Function keys
				(keyCode > 185 && keyCode < 193) || // Punctuation keys
				(keyCode > 218 && keyCode < 223); // Special characters
			if (isPrintable) {
				var option = e.target.closest("div");
				if (!option.nextElementSibling) {
					var clone = option.cloneNode(true);
					option.firstElementChild.classList.add("drag");
					clone.querySelectorAll("input").forEach(function (input) {
						input.value = "";
					});
					this.appendChild(clone);
					var button = option.appendChild(document.createElement("button"));
					button.addEventListener('click', function (e) {
						option.remove();
					});
				}
			}
		}
	};
	movePlaceholder() {
		Array.from(this.shadowRoot.querySelectorAll("li:not(.placeholder):not(.dragging)")).forEach((element) => {
			var top = this.placeholder.original.getBoundingClientRect().top;
			if (top > element.getBoundingClientRect().top && top < element.getBoundingClientRect().bottom) {
				element.parentNode.insertBefore(this.placeholder, element.nextElementSibling);
			}
			var bottom = this.placeholder.original.getBoundingClientRect().bottom;
			if (bottom > element.getBoundingClientRect().top && bottom < element.getBoundingClientRect().bottom) {
				element.parentNode.insertBefore(this.placeholder, element);
			}
		});
	}
	styleTag() {
		const style = document.createElement('style');
		style.textContent = `
		:host {
			--hue: 200;
			--sat: 0%;
			--lum: 50%;
			user-select: none;
		}
		:host > :not(style) {
			list-style-type: none;
			display: grid;
			margin: 0;
			grid-template-columns: auto 1fr 8ch 1.5em;
			gap: 0.25em;
			padding: 0.5em;
			position: relative;
			border: 1px solid hsl(var(--hue), var(--sat), 90%);
		}
		:host > :not(style) > li { 
			display: inherit;
			grid-column: 1 / -1;
			grid-template-columns: subgrid;
			box-sizing: border-box;
			border-radius: 0.25em;
			background-color: hsl(var(--hue), var(--sat), 97%);
			box-shadow: 0px 1px 1px #0006;
			padding: 0.5em;
		}
		
		:host > :not(style) > li > * {
			grid-column: 1 / -1;
			grid-template-columns: subgrid;
			display: grid;
			padding: 0.5em;
			padding-left: 0;
		}
		
		:host > :not(style) > li.placeholder {
			background-color: #0000;
			opacity: 0.5;
			border: 2px dashed #0002;
			width: 100%;
			box-shadow: none;
		}
			
		:host > :not(style) > li.dragging {
			position: absolute;
			width: 100%;
			grid-template-columns: inherit;
			gap: inherit;
		}
		
		.option input {
			padding: 0.25em;
		}
			
			
		.option > span {
			width: 1em;
			// margin: 0 -.25em 0 -.5em;
			display: flex;
			align-items: center;
			justify-content: center;
		}
			
		.option > span.drag {
			cursor: move;
			text-shadow: -1px -1px 0px #fff;
			color: #0004;
		}
			
		.option > span.drag::before {
			content: '⋮';
			content: '☰';
		}
			
		.option button {
			aspect-ratio: 1 / 1;
			background-color: transparent;
			border: none;
			align-self: center;
			justify-self: center;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.option button:before {
			content: '✖';
			color: #300c;
			text-shadow: 1px 1px 0px #fff;
		}`;
		return style;
	}
	load(element) {
		this.addEventListener('keydown', this.evt.keydown);
		var options = document.currentScript.parentNode;
		var draggingElement = null;

		element.firstElementChild.addEventListener('mousedown', this.evt.mousedown);
	}
}
customElements.define('draggable-list', Draggable);
