import { Location } from "./location.js";

export class Heightmap {

	_heightmap;
	_nbRows;
	_nbColumns;
	_lowPoints;

	constructor(heightmap) {
		this._nbRows = heightmap.length;
		this._nbColumns = heightmap[0].length;
		this._initHeightmap(heightmap);
	}

	_initHeightmap(heightmap) {
		this._heightmap = [];
		for(let i = 0; i < this._nbRows; i++) {
			const row = [];
			for(let j = 0; j < this._nbColumns; j++) {
				row.push(new Location(heightmap[i][j], i, j, this));
			}
			this._heightmap.push(row);
		}

		this._lowPoints = [];
		for(const row of this._heightmap) {
			for(const location of row) {
				location.build();
				if(location.getRiskLevel() !== 0) this._lowPoints.push(location);
			}
		}
	}

	getNbRows() {
		return this._nbRows;
	}

	getNbColumns() {
		return this._nbColumns;
	}

	getLowPoints() {
		return this._lowPoints;
	}

	get(i, j) {
		return this._heightmap[i][j];
	}

	getTotalRiskLevel() {
		return this._lowPoints.reduce((acc, curr) => acc + curr.getRiskLevel(), 0);
	}
}