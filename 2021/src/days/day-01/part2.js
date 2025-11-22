import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt')

let previousMeasurement = [];
let previousSum = null;
let largerMeasurements = 0;

for(const measurement of input) {

	let tmpMeasurement = [...previousMeasurement, parseInt(measurement[0]) ];
	if (tmpMeasurement.length > 3) tmpMeasurement.splice(0, 1);

	const tmpSum = previousMeasurement.reduce((a, b) => a+b, 0);
	if(previousMeasurement.length === 3 && tmpSum > previousSum){
		largerMeasurements++;
	}
	previousSum = tmpSum;
	previousMeasurement = tmpMeasurement;
}

console.log(largerMeasurements);