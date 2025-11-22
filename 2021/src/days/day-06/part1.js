import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const numberOfDays = 80;

let fishes = input
	.flat()[0]
	.split(',')
	.map(str => parseInt(str))
	.reduce(
		(tmpFishes, nextFish) => {
			tmpFishes[nextFish]++
			return tmpFishes;
		},
		Array(9).fill(0)
	)

for(let i = 0; i < numberOfDays; i++) {
	let start = fishes.splice(0, 1)[0];
	fishes.push(start);
	fishes[6] += start;
}

const fishCount = fishes.reduce((acc, curr) => acc + curr);

console.log(`At the end of day ${numberOfDays} we have ${fishCount} fish.`);