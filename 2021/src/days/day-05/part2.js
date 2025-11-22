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

function determineLocationsOfHydroVent([startX, startY], [endX, endY]) {

	const result = [];

	const incrementX = endX === startX ? 0 : (endX - startX) / Math.abs(endX - startX);
	const incrementY = endY === startY ? 0 : (endY - startY) / Math.abs(endY - startY);

	let x = startX;
	let y = startY;

	while(x !== endX || y !== endY) {
		result.push([x, y]);
		x += incrementX;
		y += incrementY;
	}

	result.push([endX, endY]);

	return result;
}

const hydroVentsCoords = input.map(hydroVent => parseCoords(hydroVent))
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