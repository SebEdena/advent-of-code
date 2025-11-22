import {readFile} from "../../utils/readfile.js";
import {OctopusMap} from "./octopusMap.js";

const input = await readFile('./input.txt');

const octopusMap = new OctopusMap(input.flat().map(row => row.split('').map(str => parseInt(str))));

const limit = 100;

for(let i = 0; i < limit; i++) {
	octopusMap.nextStep();
}

console.log(`After ${limit} steps, we will count ${octopusMap.flashesCount} flashes.`);