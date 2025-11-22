import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const Directions = {
	FORWARD: "forward",
	UP: "up",
	DOWN: "down"
}

// X axis = horizontal, Y axis = vertical (depth)
let x = 0, y = 0

input
	.map(value => ({ direction: value[0], speed: parseInt(value[1]) }))
	.forEach( ({ direction, speed }) => {
		switch (direction) {
			case Directions.FORWARD: x += speed; break;
			case Directions.UP: y -= speed; break;
			case Directions.DOWN: y += speed; break;
		}
	})

console.log(`x = ${x}, y = ${y}, x*y=${x*y}`);

