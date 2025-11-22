import {readFile} from "../../utils/readfile.js";

const input = Object.fromEntries(
	(await readFile('./input.txt'))
	.flat()
	.slice(2)
	.map(coord => {
		let data = coord.split('=');
		data[1] = data[1]
			.split('..')
			.map(str => parseInt(str))
			.sort((a, b) => Math.abs(a) - Math.abs(b))
		return [data[0], { min: data[1][0], max: data[1][1]} ];
	})
);

let testX = 1;
while(true) {
	let test = (testX * (testX + 1)) / 2;
	if(test >= input.x.min && test <= input.x.max) {
		break;
	} else if (test > input.x.max) {
		throw Error("Impossibru !!!");
	} else {
		testX++;
	}
}

let testY = -(input.y.max+1);

let highestY = (testY * (testY + 1)) / 2;

console.log(`Highest possible Y : ${highestY}`);