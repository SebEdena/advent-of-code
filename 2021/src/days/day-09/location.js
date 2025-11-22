export class Location {

	_value;
	_row;
	_column;
	_neighbors;
	_riskLevel;

	constructor(value, row, column, heightmap) {
		this._value = value;
		this._row = row;
		this._column = column;
		this._heightmap = heightmap;
	}

	build(){
		const nbRows = this._heightmap.getNbRows();
		const nbColumns = this._heightmap.getNbColumns();

		const neighborsArray = [
			[this._row - 1, this._column],
			[this._row, this._column + 1],
			[this._row + 1, this._column],
			[this._row, this._column - 1]
		];

		this._neighbors = neighborsArray
			.filter(([row, col]) => row >= 0 && row < nbRows && col >= 0 && col < nbColumns)
			.map(([row, col]) => this._heightmap.get(row, col));

		this._riskLevel = this._neighbors.every(neighbor => neighbor.getValue() > this._value) ? this._value + 1 : 0;
	}

	getValue() {
		return this._value;
	}

	getRiskLevel() {
		return this._riskLevel;
	}

	getNeighbors() {
		return this._neighbors;
	}

	basinSize() {
		const neighbors = [...this._neighbors];
		const visitedNeighbors = new Set();
		let sum = 0;
		while(neighbors.length !== 0) {
			const nextNeighbor = neighbors.splice(0, 1)[0];
			if(nextNeighbor.getValue() !== 9 && !visitedNeighbors.has(nextNeighbor)) {
				neighbors.push(...nextNeighbor.getNeighbors());
				visitedNeighbors.add(nextNeighbor);
				sum += 1;
			}
		}
		return sum;
	}
}