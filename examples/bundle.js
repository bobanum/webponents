(()=>{var o=class{constructor(t={},e){return this.that=t,this.target=e,this.createProxy(t,e)}createProxy(t,e={}){return new Proxy(e,{get:function(r,i){return i in r?r[i]:this.getAttribute(i)}.bind(t),set:function(r,i,s){return r[i]===s||(r[i]=s,this.hasAttribute(i)&&this.getAttribute(i)===s)||(s==null||s===!1?this.removeAttribute(i):(s===!0&&(s=""),this.setAttribute(i,s))),!0}.bind(t)})}static asserts={Number:t=>{if(t instanceof Number)return t;if(t=Number(t),!isNaN(t))return t},Boolean:t=>t instanceof Boolean?t:t==="false"?!1:typeof t=="string"?!0:!!t,Integer:t=>{if(t instanceof Number)return Math.floor(t);if(t=parseInt(t),!isNaN(t))return t},Float:t=>{if(t instanceof Number)return t;if(t=parseFloat(t),!isNaN(t))return t},URL:t=>{try{return new URL(t,location)}catch{return}}}};var n=class extends HTMLElement{static affix="-ponent";static meta;rendered=null;constructor(){super(),this._=new o(this),this._$={},this.attachShadow({mode:"open"})}attributeChangedCallback(t,e,r){e!==r&&(this[t]=r)}static get slug(){return this.toKebabCase(this.name)}get dom(){return{style:t=>{let e=document.createElement("style");return e.textContent=t,e}}}static properties={};static setMeta(t){return this.meta=t,this.getUrlData(this.meta.url),this}static get observedAttributes(){return this.defineProperties(this.properties)}static defineProperties(t={}){for(let[e,r]of Object.entries(t))this.defineProperty(e,r);return Object.keys(t)}static defineProperty(t,e){typeof e=="function"?e={type:e}:typeof e!="object"&&(e={type:e.constructor,default:e}),e.type===void 0&&(e.type=String),e.assert??=o.asserts[e.type.name]??e.type;let r={get(){return e.get?e.get.call(this):t in this._?this._[t]:this.hasAttribute(t)?e.assert.call(this,this.getAttribute(t)):e.default},set(i){if(i=e.assert.call(this,i),i===void 0)return delete this._[t],!0;t in this._&&this._[t]===i||(this._[t]=i,e.set&&e.set.call(this,i))}};Object.defineProperty(this.prototype,t,r)}static createProperty(t,e={}){return{[t]:{get(){return e.get?e.get.call(this):this._[t]},set(r){this._[t]!==r&&(this._[t]=r,e.set&&e.set.call(this,r))}}}}static createProperties(t={}){let e={};for(let[r,i]of Object.entries(t))e[r]=this.createProperty(r,i)[r];return e}static fixed(t){let e=this.toKebabCase(t||this.name).replaceAll(/(?:^_+|_+$)/g,""),[r,i]=this.affix.split("-");return r&&!e.startsWith(`${r}-`)&&(e=`${r}-${e}`),i&&!e.endsWith(`-${i}`)&&(e=`${e}-${i}`),e}static getUrlData(t,e=this){let r=new URL(t);for(let[i,s]of r.searchParams.entries())e[i]=s;return e}static toKebabCase(t){return t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}static register(t,e){e&&this.setMeta(e),t=this.fixed(t),customElements.get(t)||(console.log(`Registering custom element: ${t}`),customElements.define(t,this))}};var c=`:host {\r
	--drawer-size: 200px;\r
	--handle-width: .8rem;\r
	--pin-size: 1rem;\r
	--hue: 210;\r
	--sat: 50%;\r
	--lum: 90%;\r
	font-size: 1rem;\r
	position: fixed;\r
	left: 0;\r
	box-sizing: border-box;\r
	overflow: hidden;\r
	transition-duration: 300ms;\r
	transition-property: width;\r
	transition-timing-function: ease-in;\r
	z-index: 1000;\r
	width: var(--handle-width);\r
}\r
:host(:hover) {\r
	transition-delay: 750ms;\r
	width: calc(var(--drawer-size) + var(--handle-width));\r
}\r
:host(:focus-within) {\r
	width: calc(var(--drawer-size) + var(--handle-width));\r
}\r
:host(:not([pinned])) {\r
	top: .5rem;\r
	bottom: .5rem;\r
	/* width: calc(var(--drawer-size) + var(--handle-width)); */\r
}\r
:host([pinned]) {\r
	top: 0;\r
	bottom: 0;\r
	width: calc(var(--drawer-size) + var(--handle-width));\r
	.content {\r
		border-radius: 0;\r
		box-shadow: none;\r
	}\r
	.handle {\r
		display: none;\r
	}\r
	.pin {\r
		opacity: .6;\r
		&::before {\r
			content: '\u{1F512}\\FE0E';\r
		}\r
	}\r
}\r
*, *::before, *::after {\r
	box-sizing: border-box;\r
}\r
main {\r
	box-sizing: border-box;\r
	width: var(--drawer-size);\r
	overflow-y: auto;\r
	height: 100%;\r
	background-color: hsl(var(--hue), var(--sat), var(--lum));\r
	position: absolute;\r
	right: var(--handle-width);\r
	border-radius: 0 1em 1em 0;\r
	box-shadow: inset 0 0 10px #0003;\r
}\r
.pin {\r
	position: absolute;\r
	right: var(--handle-width);\r
	top: 0;\r
	font-size: var(--pin-size);\r
	width: 2em;\r
	height: 2em;\r
	cursor: pointer;\r
	z-index: 10;\r
	display: grid;\r
	place-items: center;\r
	opacity: .3;\r
\r
	&::before {\r
		content: '\u{1F513}\\FE0E';\r
		line-height: 1;\r
		color: hsl(var(--hue), var(--sat), 50%);\r
	}\r
}\r
.handle {\r
	position: absolute;\r
	right: 0em;\r
	top: 0;\r
	width: var(--handle-width);\r
	height: 100%;\r
	cursor: ew-resize;\r
	z-index: 5;\r
	display: grid;\r
	place-items: center;\r
	opacity: .5;\r
	transition: opacity 150ms ease-in-out;\r
\r
	&:hover {\r
		opacity: 1;\r
	}\r
	&::before {\r
		content: '\u2022\\0A\u2022\\0A\u2022';\r
		white-space: pre;\r
		position: absolute;\r
		left: 0%;\r
		top: 50%;\r
		display: grid;\r
		place-items: center;\r
		font-size: .8em;\r
		transform: translate(0%, -50%);\r
		width: 100%;\r
		height: 4em;\r
		background-color: hsl(var(--hue), var(--sat), calc(var(--lum) - 20%));\r
		text-shadow: 1px 1px 1px #0005, -1px -1px 1px #FFF9;\r
		line-height: 1;\r
		color: hsl(var(--hue), var(--sat), calc(var(--lum) - 20%));\r
		border-radius: 0 1ch 1ch 0;\r
	}\r
}`;var a=class extends n{connectedCallback(){this.tabIndex=1,this.shadowRoot.appendChild(super.dom.style(c)),this.rendered=this.shadowRoot.appendChild(this.dom.main())}static properties={pinned:{type:Boolean},size:{type:"Number",default:250,set:function(t){this.style.setProperty("--drawer-size",t+"px")}},open:{type:Boolean}};get dom(){return{main:()=>{let t=document.createDocumentFragment();t.appendChild(this.dom.handle()),t.appendChild(this.dom.pin());let e=document.createElement("main");e.part="content";let r=document.createElement("slot");return e.appendChild(r),t.appendChild(e),t},handle:()=>{let t=document.createElement("div");return t.classList.add("handle"),t.part="handle",t},pin:()=>{let t=document.createElement("div");return t.classList.add("pin"),t.part="pin",t.addEventListener("click",()=>{this.pinned=!this.pinned,this.parentNode.style.marginLeft=this.pinned?"250px":""}),t}}}};a.register("drawer");var d=class extends n{connectedCallback(){this.render()}render(){let t=this.rendered;return this.rendered=this.dom.main(),t?t.replaceWith(this.rendered):this.shadowRoot.appendChild(this.rendered),this.rendered}dom={main:()=>{let t=document.createElement("h"+this.level);return t.appendChild(document.createElement("slot")),t}};static properties={level:{type:Number,default:1,assert(t){if(t=Number(t),!isNaN(t))return this.cycle(t)},set(t){this.rendered&&this.render()}}};cycle(t,e=1,r=6){let i=r-e+1;return((t-e)%i+i)%i+e}};d.register("title");})();
