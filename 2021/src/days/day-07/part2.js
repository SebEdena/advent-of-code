// Please see this subreddit : https://www.reddit.com/r/adventofcode/comments/rawxad/2021_day_7_part_2_i_wrote_a_paper_on_todays/

import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const crabPositions = input
	.flat()[0]
	.split(',')
	.map(str => parseInt(str));

function computeFuel(crabs, position) {
	return crabs
		.map(pos => Math.abs(position - pos))
		.map(linearFuel => (linearFuel * (linearFuel + 1)) / 2)
		.reduce((acc, curr) => acc + curr)
}

const numberOfCrabs = crabPositions.length;

const mean = crabPositions.reduce((acc, curr) => acc + curr) / numberOfCrabs;

const bestPosition = [Math.ceil(mean), Math.floor(mean)]
	.map(position => ({ position, fuel: computeFuel(crabPositions, position)}))
	.sort((a, b) => a.fuel - b.fuel)[0];

console.log(`Optimal crab position to save your life : ${bestPosition.position}, consumes ${bestPosition.fuel} fuel.`)