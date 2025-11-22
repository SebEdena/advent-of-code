export class Node {

	_parent;
	_value;
	_left;
	_right;

	constructor(parent, value, left, right) {
		this._parent = parent;
		this._value = value;
		this._left = left;
		this._right = right;
	}

	get parent() {
		return this._parent;
	}

	set parent(value) {
		this._parent = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._value = value;
	}

	get left() {
		return this._left;
	}

	set left(value) {
		this._left = value;
	}

	get right() {
		return this._right;
	}

	set right(value) {
		this._right = value;
	}
}