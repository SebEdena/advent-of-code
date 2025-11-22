import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt')

let previousMeasurement = null;
let largerMeasurements = 0;

for(const measurement of input) {
	if(previousMeasurement != null) {
		if(parseInt(measurement[0]) > previousMeasurement) {
			largerMeasurements++;
		}
	}
	previousMeasurement = measurement[0];
}

console.log(largerMeasurements);