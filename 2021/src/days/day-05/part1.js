import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

function parseCoords(hydroVent) {
	let result = []
	hydroVent.splice(1, 1);
	for(const coord of hydroVent) {
		result.push(
			coord.split(',').map(str => parseInt(str))
		);
	}
	return result;
}

function determineLocationsOfHydroVent(start, finish) {
	const result = [];
	const startX = Math.min(start[0], finish[0]);
	const endX = Math.max(start[0], finish[0]);
	const startY = Math.min(start[1], finish[1]);
	const endY = Math.max(start[1], finish[1]);

	for (let i = startX; i <= endX; i++) {
		for (let j = startY; j <= endY; j++) {
			result.push([i, j]);
		}
	}
	return result;
}

const hydroVentsCoords = input
	.map(hydroVent => parseCoords(hydroVent))
	.filter(([start, finish]) => (start[0] === finish[0] || start[1] === finish[1]))
const hydroVentsLocation = {};

hydroVentsCoords.forEach(([start, finish]) => {
	const tmpVents = determineLocationsOfHydroVent(start, finish);
	for(const [tmpStart, tmpFinish] of tmpVents) {
		const key = `${tmpStart},${tmpFinish}`;
		if(hydroVentsLocation[key]) {
			hydroVentsLocation[key]++;
		} else {
			hydroVentsLocation[key] = 1;
		}
	}
});

const veryCloudyLocations = Object.fromEntries(Object.entries(hydroVentsLocation).filter(([, value]) => value > 1));

console.log('Coordinates to not go to :');
console.log(veryCloudyLocations);
console.log(`Total : ${Object.keys(veryCloudyLocations).length}`);