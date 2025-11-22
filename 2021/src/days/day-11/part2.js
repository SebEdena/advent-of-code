import {readFile} from "../../utils/readfile.js";
import {OctopusMap} from "./octopusMap.js";

const input = await readFile('./input.txt');

const octopusMap = new OctopusMap(input.flat().map(row => row.split('').map(str => parseInt(str))));

let step = 0;

while (!octopusMap.allFlashed()) {
	octopusMap.nextStep();
	step++;
}

console.log(`You must wait ${step} steps to see all octopuses flash at once.`);