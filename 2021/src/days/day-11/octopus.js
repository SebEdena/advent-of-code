export class Octopus {

	_energy;
	_neighbours;

	constructor(value) {
		this._energy = value;
	}

	get energy() {
		return this._energy;
	}

	set energy(value) {
		this._energy = value;
	}

	get neighbours() {
		return this._neighbours;
	}

	set neighbours(neighbours) {
		this._neighbours = neighbours;
	}

	gainEnergy() {
		this._energy++;
	}

	flash() {
		this._energy = 0;
	}

}