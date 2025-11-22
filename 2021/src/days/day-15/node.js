export class Node {

	_x
	_y

	_localRisk
	_risk
	_f

	_parent

	constructor(x, y, localRisk) {
		this._x = x;
		this._y = y;
		this._localRisk = localRisk;
		this._risk = Infinity;
		this._f = Infinity;
	}

	get risk() {
		return this._risk;
	}

	set risk(value) {
		this._risk = value;
	}

	get f() {
		return this._f;
	}

	set f(value) {
		this._f = value;
	}

	get parent() {
		return this._parent;
	}

	set parent(value) {
		this._parent = value;
	}

	get x() {
		return this._x;
	}

	set x(value) {
		this._x = value;
	}

	get y() {
		return this._y;
	}

	set y(value) {
		this._y = value;
	}

	get localRisk() {
		return this._localRisk;
	}

	set localRisk(value) {
		this._localRisk = value;
	}
}