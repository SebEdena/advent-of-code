import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const Directions = {
	FORWARD: "forward",
	UP: "up",
	DOWN: "down"
}

// X axis = horizontal, Y axis = vertical (depth)
let x = 0, y = 0, aim = 0;

input
	.map(value => ({ direction: value[0], amount: parseInt(value[1]) }))
	.forEach( ({ direction, amount }) => {
		switch (direction) {
			case Directions.FORWARD: x += amount; y += aim * amount; break;
			case Directions.UP: aim -= amount; break;
			case Directions.DOWN: aim += amount; break;
		}
	})

console.log(`x = ${x}, y = ${y}, x*y=${x*y}`);

