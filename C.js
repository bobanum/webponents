class C {
	prototypeProperty = 2;
	static staticProperty = 3;
	constructor() {
		this.newProperty = 5;
	}
	get getterProperty() {
		return 9;
	}
	prototypeFunction() {
		return 12;
	}
	proto = (() => {
		console.log("proto", this);
		
		this.constructor.proto = this;
		return this;
	})();
		
	// otherFunction = () => {
	// 	return 13;
	// }
	static staticFunction() {
		return 15;
	}
	static init() {
		this.prototype.DOM = new this().DOM;
	}
}
console.log(C.prototype.prototypeProperty);
C.init();
let c = new C();
console.log(c.prototype, c.__proto__);