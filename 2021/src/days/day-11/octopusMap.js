import { Octopus } from "./octopus.js";

export class OctopusMap {

	static nbRows = 10;
	static nbCols = 10;

	_octopusMap;
	_flashesCount;

	constructor(heightmap) {
		this._flashesCount = 0;
		this._initOctopusMap(heightmap);
	}

	_initOctopusMap(octopusMap) {
		this._octopusMap = octopusMap.map(
			row => row.map(
				octopusValue => new Octopus(octopusValue)
			)
		)

		for(let i = 0; i < OctopusMap.nbRows; i++) {
			for(let j = 0; j < OctopusMap.nbCols; j++) {
				const neighbours = []
				for(let i2 = Math.max(0, i - 1); i2 <= Math.min(OctopusMap.nbRows - 1, i + 1); i2++) {
					for(let j2 = Math.max(0, j - 1); j2 <= Math.min(OctopusMap.nbCols - 1, j + 1); j2++) {
						if(i !== i2 || j !== j2) {
							neighbours.push(this._octopusMap[i2][j2]);
						}
					}
				}
				this._octopusMap[i][j].neighbours = neighbours;
			}
		}
	}

	get flashesCount() {
		return this._flashesCount;
	}

	nextStep() {
		for (const octopusRow of this._octopusMap) {
			for(const octopus of octopusRow) {
				octopus.gainEnergy();
			}
		}

		let test = this._octopusMap.flat().find(octopus => octopus.energy > 9);
		while(test !== undefined) {
			const octopusToVisit = test.neighbours.filter(octopus => octopus.energy > 0);
			octopusToVisit.forEach(octopus => octopus.gainEnergy());
			test.flash();
			this._flashesCount++;
			test = this._octopusMap.flat().find(octopus => octopus.energy > 9);
		}
	}

	allFlashed() {
		return this._octopusMap.flat().every(octopus => octopus.energy === 0);
	}
}