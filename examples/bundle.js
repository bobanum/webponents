(()=>{var n=class{constructor(t={},e){return this.that=t,this.target=e,this.createProxy(t,e)}createProxy(t,e={}){return new Proxy(e,{get:function(r,i){return i in r?r[i]:this.getAttribute(i)}.bind(t),set:function(r,i,s){return r[i]===s||(r[i]=s,this.hasAttribute(i)&&this.getAttribute(i)===s)||(s==null||s===!1?this.removeAttribute(i):(s===!0&&(s=""),this.setAttribute(i,s))),!0}.bind(t)})}static asserts={Number:t=>{if(t instanceof Number)return t;if(t=Number(t),!isNaN(t))return t},Boolean:t=>t instanceof Boolean?t:t==="false"?!1:typeof t=="string"?!0:!!t,Integer:t=>{if(t instanceof Number)return Math.floor(t);if(t=parseInt(t),!isNaN(t))return t},Float:t=>{if(t instanceof Number)return t;if(t=parseFloat(t),!isNaN(t))return t},URL:t=>{try{return new URL(t,location)}catch{return}}}};var a=class extends HTMLElement{static affix="-ponent";static meta;rendered=null;constructor(){super(),this._=new n(this),this._$={},this.attachShadow({mode:"open"})}attributeChangedCallback(t,e,r){e!==r&&(this[t]=r)}get dom(){return{style:t=>{let e=document.createElement("style");return e.textContent=t,e},slot:(t,e)=>{let r=document.createElement("slot");return t&&(r.name=t),typeof e=="string"&&(e=document.createTextNode(e)),e&&r.appendChild(e),r}}}static properties={};static setMeta(t){return this.meta=t,this.getUrlData(this.meta.url),this}static get observedAttributes(){return this.defineProperties(this.properties)}static defineProperties(t={}){for(let[e,r]of Object.entries(t))this.defineProperty(e,r);return Object.keys(t)}static defineProperty(t,e){typeof e=="function"?e={type:e}:typeof e!="object"&&(e={type:e.constructor,default:e}),e.type===void 0&&(e.type=String),e.assert=e.assert??n.asserts[e.type.name]??n.asserts[e.type]??(typeof e.type=="function"?e.type:i=>i);let r={get(){return e.get?e.get.call(this):t in this._?this._[t]:this.hasAttribute(t)?e.assert.call(this,this.getAttribute(t)):e.default},set(i){if(i=e.assert.call(this,i),i===void 0)return delete this._[t],!0;t in this._&&this._[t]===i||(this._[t]=i,e.set&&e.set.call(this,i))}};Object.defineProperty(this.prototype,t,r)}static createProperty(t,e={}){return{[t]:{get(){return e.get?e.get.call(this):this._[t]},set(r){this._[t]!==r&&(this._[t]=r,e.set&&e.set.call(this,r))}}}}static createProperties(t={}){let e={};for(let[r,i]of Object.entries(t))e[r]=this.createProperty(r,i)[r];return e}static fixed(t){let e=this.toKebabCase(t||this.name).replaceAll(/(?:^[_0-9.+]+|[_0-9.+]+$)/g,""),[r,i]=this.affix.split("-");return r&&!e.startsWith(`${r}-`)&&(e=`${r}-${e}`),i&&!e.endsWith(`-${i}`)&&(e=`${e}-${i}`),e}static getUrlData(t,e=this){let r=new URL(t);for(let[i,s]of r.searchParams.entries())e[i]=s;return e}static toKebabCase(t){return t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}static register(t,e){e&&this.setMeta(e),t=this.fixed(t),customElements.get(t)||customElements.define(t,this)}};var l=`:host {\r
	--drawer-size: 200px; /* Width or height of the drawer */\r
	--handle-width: 1rem; /* Width or height of the handle */\r
	--pin-size: 1rem;	 /* Size of the pin area */\r
	--radius: 0.5rem;	/* Border radius */\r
	--padding: 0;		 /* Padding inside the drawer */\r
	/* Color variables */\r
	--hue: 0;	/* Base hue for colors */\r
	--sat: 0%;	/* Base saturation for colors */\r
	--lum: 95%;	/* Base lightness for colors */\r
	--alpha: 1;	/* Base alpha for colors */\r
	/* Transition variables */\r
	--duration: 200ms;	/* Transition duration */\r
	--delay: 150ms;	/* Transition delay */\r
	--ease: ease-in-out;	/* Transition timing function */\r
}\r
`;var c=`:host {\r
	font-size: 1rem;\r
	position: fixed;\r
	box-sizing: border-box;\r
	overflow: hidden;\r
	transition-property: width, height;\r
	transition-duration: var(--duration);\r
	transition-timing-function: var(--ease);\r
	z-index: 1000;\r
	--opening: calc(var(--drawer-size) + var(--handle-width));\r
	--bg-color: hsl(var(--hue), var(--sat), var(--lum), var(--alpha));\r
}\r
\r
*,\r
*::before,\r
*::after {\r
	box-sizing: border-box;\r
}\r
\r
.container {\r
	display: grid;\r
	grid-row: 1;\r
	position: absolute;\r
	&:not(:hover) .handle {\r
		background-color: hsl(from var(--bg-color) h s l / 0.5);\r
	}\r
}\r
\r
main {\r
	background-color: var(--bg-color);\r
	border-radius: var(--border-radius);\r
	box-shadow: inset 0 0 10px #0003;\r
	box-sizing: border-box;\r
	grid-area: content;\r
	overflow-y: auto;\r
	position: relative;\r
	padding: var(--padding);\r
}\r
\r
.handle {\r
	background-color: var(--bg-color);\r
	color: var(--bg-color);\r
	border-radius: var(--border-radius);\r
	cursor: grab;\r
	\r
	display: grid;\r
	font-size: .8em;\r
	grid-area: handle;\r
	line-height: 1;\r
	/* opacity: .5; */\r
	place-items: center;\r
	text-shadow: 0px 0px 1px #FFF9, 1px 1px 1px #0005;\r
\r
	&::before {\r
		content: '\u2022 \u2022 \u2022';\r
		padding-inline: 2ch;\r
		word-spacing: 1ch;\r
	}\r
}\r
\r
.pin {\r
	color: hsl(var(--hue), var(--sat), 50%);\r
	cursor: pointer;\r
	display: grid;\r
	font-size: var(--pin-size);\r
	height: 2em;\r
	line-height: 1;\r
	opacity: .3;\r
	place-items: center;\r
	position: absolute;\r
	width: 2em;\r
	z-index: 10;\r
\r
	&::before {\r
		content: '\u{1F513}\\FE0E';\r
	}\r
	&:hover {\r
		opacity: 1;\r
		text-shadow: 1px 1px 1px #0005;\r
	}\r
}\r
\r
/* Defaults for side */\r
:host,\r
:host([side="right"]) {\r
	inset: var(--radius) var(--a) var(--radius) var(--b);\r
	width: var(--opening);\r
	height: auto;\r
\r
	.handle {\r
		place-self: center stretch;\r
		margin: var(--radius) 0;\r
\r
		&::before {\r
			writing-mode: vertical-lr;\r
		}\r
	}\r
\r
	.container {\r
		inset: 0 var(--b) 0 var(--a);\r
		grid-template-rows: [handle content] 1fr;\r
	}\r
\r
	.pin {\r
		inset: 0 var(--b) 0 var(--a);\r
	}\r
}\r
\r
:host([side="top"]),\r
:host([side="bottom"]) {\r
	inset: var(--b) var(--radius) var(--a) var(--radius);\r
	height: var(--opening);\r
	width: auto;\r
\r
	.handle {\r
		place-self: stretch center;\r
		margin: 0 var(--radius);\r
\r
		&::before {\r
			writing-mode: horizontal-tb;\r
\r
		}\r
	}\r
\r
	.container {\r
		grid-template-columns: [handle content] 1fr;\r
		inset: var(--a) 0 var(--b) 0;\r
	}\r
\r
	.pin {\r
		inset: var(--a) 0 var(--b) auto;\r
	}\r
}\r
\r
:host {\r
	--a: auto;\r
	--b: 0;\r
	--border-radius: 0 var(--radius) var(--radius) 0;\r
\r
	.container {\r
		grid-template-columns:\r
			[content] var(--drawer-size) [handle] var(--handle-width);\r
	}\r
}\r
\r
:host([side="right"]) {\r
	--a: 0;\r
	--b: auto;\r
	--border-radius: var(--radius) 0 0 var(--radius);\r
\r
	.container {\r
		grid-template-columns:\r
			[handle] var(--handle-width) [content] var(--drawer-size);\r
	}\r
}\r
\r
:host([side="top"]) {\r
	--a: auto;\r
	--b: 0;\r
	--border-radius: 0 0 var(--radius) var(--radius);\r
\r
	.container {\r
		grid-template-rows:\r
			[content] var(--drawer-size) [handle] var(--handle-width);\r
	}\r
}\r
\r
:host([side="bottom"]) {\r
	--a: 0;\r
	--b: auto;\r
	--border-radius: var(--radius) var(--radius) 0 0;\r
\r
	.container {\r
		grid-template-rows:\r
			[handle] var(--handle-width) [content] var(--drawer-size);\r
	}\r
}\r
\r
:host(:hover) {\r
	transition-delay: var(--delay);\r
	z-index: 1001;\r
}\r
:host(:not(:hover)) {\r
	--opening: var(--handle-width);\r
}\r
\r
:host(:focus-within) {\r
	main {\r
		outline: hsl(var(--hue), var(--sat), 50%, .5) solid 1px;\r
		outline-offset: -1px;\r
		--opening: calc(var(--drawer-size) + var(--handle-width));\r
	}\r
}\r
:host(:not(:hover):focus-within) {\r
	--opening: calc(var(--drawer-size) + var(--handle-width));\r
}\r
\r
:host([pinned]) {\r
	--opening: calc(var(--drawer-size) + var(--handle-width));\r
	--radius: 0;\r
\r
	.content {\r
		/* border-radius: 0; */\r
		box-shadow: none;\r
	}\r
\r
	.handle {\r
		display: none;\r
	}\r
\r
	.pin {\r
		opacity: 1;\r
		&::before {\r
			content: '\u{1F512}\\FE0E';\r
		}\r
	}\r
}`;var o=class extends a{connectedCallback(){this.tabIndex=1,this.size=this.size,this.shadowRoot.appendChild(super.dom.style(l+c)),this.rendered=this.shadowRoot.appendChild(this.dom.main())}static properties={pinned:{type:"Boolean"},size:{type:Number,default:250,set:function(t){this.style.setProperty("--drawer-size",t+"px")}},side:{type:String,default:"left"}};get dom(){return{main:()=>{let t=document.createElement("div");t.classList.add("container"),t.appendChild(this.dom.handle());let e=document.createElement("main");e.part="content",e.appendChild(this.dom.pin());let r=document.createElement("slot");return e.appendChild(r),t.appendChild(e),t},handle:()=>{let t=document.createElement("div");return t.classList.add("handle"),t.part="handle",t},pin:()=>{let t={left:"margin-left",right:"margin-right",top:"margin-top",bottom:"margin-bottom"},e=document.createElement("div");return e.classList.add("pin"),e.part="pin",e.addEventListener("click",()=>{this.pinned=!this.pinned,console.log(),this.pinned?document.body.style.setProperty(t[this.side],this.size+"px"):document.body.style.removeProperty(t[this.side])}),e}}}};o.register("drawer");var d=class extends a{connectedCallback(){this.render()}render(){let t=this.rendered;return this.rendered=this.dom.main(),t?t.replaceWith(this.rendered):this.shadowRoot.appendChild(this.rendered),this.rendered}dom={main:()=>{let t=document.createElement("h"+this.level);return t.appendChild(document.createElement("slot")),t}};static properties={level:{type:Number,default:1,assert(t){if(t=Number(t),!isNaN(t))return this.cycle(t)},set(t){this.rendered&&this.render()}}};cycle(t,e=1,r=6){let i=r-e+1;return((t-e)%i+i)%i+e}};d.register("title");})();
