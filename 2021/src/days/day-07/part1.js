import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const crabPositions = input
	.flat()[0]
	.split(',')
	.map(str => parseInt(str));

const numberOfCrabs = crabPositions.length;

const crabSortedPositions = [...crabPositions].sort((a, b) => a - b);

let median;

if(numberOfCrabs % 2 === 0) {
	median = (crabSortedPositions[numberOfCrabs/2 - 1] + crabSortedPositions[numberOfCrabs/2]) / 2;
} else {
	median = crabSortedPositions[Math.floor(numberOfCrabs / 2)];
}

const fuel = crabPositions
	.map(pos => Math.abs(median - pos))
	.reduce((acc, curr) => acc + curr);

console.log(`Optimal crab position to save your life : ${median}, consumes ${fuel} fuel.`)