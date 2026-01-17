(()=>{var o=class{constructor(e={},t){return this.that=e,this.target=t,this.createProxy(e,t)}createProxy(e,t={}){return new Proxy(t,{get:function(r,i){return i in r?r[i]:this.getAttribute(i)}.bind(e),set:function(r,i,s){return r[i]===s||(r[i]=s,this.hasAttribute(i)&&this.getAttribute(i)===s)||(s==null||s===!1?this.removeAttribute(i):(s===!0&&(s=""),this.setAttribute(i,s))),!0}.bind(e)})}static asserts={Number:e=>{if(e instanceof Number)return e;if(e=Number(e),!isNaN(e))return e},Boolean:e=>e instanceof Boolean?e:e==="false"?!1:typeof e=="string"?!0:!!e,Integer:e=>{if(e instanceof Number)return Math.floor(e);if(e=parseInt(e),!isNaN(e))return e},Float:e=>{if(e instanceof Number)return e;if(e=parseFloat(e),!isNaN(e))return e},URL:e=>{try{return new URL(e,location)}catch{return}}}};var n=class extends HTMLElement{static affix="-ponent";static meta;rendered=null;constructor(){super(),this._=new o(this),this._$={},this.attachShadow({mode:"open"})}attributeChangedCallback(e,t,r){t!==r&&(this[e]=r)}get dom(){return{style:e=>{let t=document.createElement("style");return t.textContent=e,t},slot:(e,t)=>{let r=document.createElement("slot");return e&&(r.name=e),typeof t=="string"&&(t=document.createTextNode(t)),t&&r.appendChild(t),r}}}static properties={};static setMeta(e){return this.meta=e,this.getUrlData(this.meta.url),this}static get observedAttributes(){return this.defineProperties(this.properties)}static defineProperties(e={}){for(let[t,r]of Object.entries(e))this.defineProperty(t,r);return Object.keys(e)}static defineProperty(e,t){typeof t=="function"?t={type:t}:typeof t!="object"&&(t={type:t.constructor,default:t}),t.type===void 0&&(t.type=String),t.assert=t.assert??o.asserts[t.type.name]??o.asserts[t.type]??(typeof t.type=="function"?t.type:i=>i);let r={get(){return t.get?t.get.call(this):e in this._?this._[e]:this.hasAttribute(e)?t.assert.call(this,this.getAttribute(e)):t.default},set(i){if(i=t.assert.call(this,i),i===void 0)return delete this._[e],!0;e in this._&&this._[e]===i||(this._[e]=i,t.set&&t.set.call(this,i))}};Object.defineProperty(this.prototype,e,r)}static createProperty(e,t={}){return{[e]:{get(){return t.get?t.get.call(this):this._[e]},set(r){this._[e]!==r&&(this._[e]=r,t.set&&t.set.call(this,r))}}}}static createProperties(e={}){let t={};for(let[r,i]of Object.entries(e))t[r]=this.createProperty(r,i)[r];return t}static fixed(e){let t=this.toKebabCase(e||this.name).replaceAll(/(?:^[_0-9.+]+|[_0-9.+]+$)/g,""),[r,i]=this.affix.split("-");return r&&!t.startsWith(`${r}-`)&&(t=`${r}-${t}`),i&&!t.endsWith(`-${i}`)&&(t=`${t}-${i}`),t}static getUrlData(e,t=this){let r=new URL(e);for(let[i,s]of r.searchParams.entries())t[i]=s;return t}static toKebabCase(e){return e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}static register(e,t={}){t.meta&&(this.setMeta(t.meta),delete t.meta),e=this.fixed(e),customElements.get(e)||(console.log(`Registering custom element: ${e}`),customElements.define(e,this,t))}};var u=`:host {\r
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
`;var p=`:host {\r
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
}`;var d=class extends n{connectedCallback(){this.tabIndex=1,this.size=this.size,this.shadowRoot.appendChild(super.dom.style(u+p)),this.rendered=this.shadowRoot.appendChild(this.dom.main())}static properties={pinned:{type:"Boolean"},size:{type:Number,default:250,set:function(e){this.style.setProperty("--drawer-size",e+"px")}},side:{type:String,default:"left"}};get dom(){return{main:()=>{let e=document.createElement("div");e.classList.add("container"),e.appendChild(this.dom.handle());let t=document.createElement("main");t.part="content",t.appendChild(this.dom.pin());let r=document.createElement("slot");return t.appendChild(r),e.appendChild(t),e},handle:()=>{let e=document.createElement("div");return e.classList.add("handle"),e.part="handle",e},pin:()=>{let e={left:"margin-left",right:"margin-right",top:"margin-top",bottom:"margin-bottom"},t=document.createElement("div");return t.classList.add("pin"),t.part="pin",t.addEventListener("click",()=>{this.pinned=!this.pinned,console.log(),this.pinned?document.body.style.setProperty(e[this.side],this.size+"px"):document.body.style.removeProperty(e[this.side])}),t}}}};d.register("drawer");var l=class extends n{connectedCallback(){this.render()}render(){let e=this.rendered;return this.rendered=this.dom.main(),e?e.replaceWith(this.rendered):this.shadowRoot.appendChild(this.rendered),this.rendered}dom={main:()=>{let e=document.createElement("h"+this.level);return e.appendChild(document.createElement("slot")),e}};static properties={level:{type:Number,default:1,assert(e){if(e=Number(e),!isNaN(e))return this.cycle(e)},set(e){this.rendered&&this.render()}}};cycle(e,t=1,r=6){let i=r-t+1;return((e-t)%i+i)%i+t}};l.register("title");var h=class extends n{connectedCallback(){this.shadowRoot.appendChild(this.dom.style()),this.shadowRoot.appendChild(this.dom.main())}dom={style:()=>{let e=document.createDocumentFragment(),t=document.createElement("style");return t.textContent=`
				:host {
					--hue: 200;
					--sat: 80%;
					background-color: hsl(var(--hue), var(--sat), 30%);
					display: flex;
				}`,e.appendChild(t),e},main:()=>{let e=document.createElement("div");return e.appendChild(document.createElement("slot")),e}}},c=class extends Component{constructor(){super(),this.trigger=document.createElement("a"),this.iconElement=document.createElement("img"),this.labelElement=document.createElement("span")}connectedCallback(){console.log("ici"),this.shadowRoot.appendChild(this.dom.style()),this.shadowRoot.appendChild(this.dom.main())}static properties={icon:this.createProperty("icon",{set(e){this.iconElement.src=e}}),label:this.createProperty("label",{set(e){this.labelElement.textContent=e}})};dom={style:()=>{let e=document.createElement("style");return e.textContent=`
				:host {
					display: inline-flex;
				}
				a {
					display: flex;
					align-items: center;
					text-decoration: none;
					color: inherit;
				}
			`,e},main:()=>{let e=document.createElement("div");return e.appendChild(this.dom.trigger()),e.appendChild(document.createElement("slot")),e},icon:()=>this.iconElement,trigger:()=>{let e=this.trigger;return e.tabIndex=1,e.href="#",e.appendChild(this.dom.icon()),e.appendChild(this.labelElement),e.addEventListener("click",t=>{this.dispatchEvent(new Event("click"))}),e}}};h.register("menu");c.register("menu-item");})();
