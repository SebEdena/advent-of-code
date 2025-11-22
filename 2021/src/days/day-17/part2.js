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
		return [data[0], { min: data[1][0], max: data[1][1]} ];
	})
);

function computeMinX(coordinates) {
	let testX = 1;
	while(true) {
		let test = (testX * (testX + 1)) / 2;
		if(test >= input.x.min && test <= input.x.max) {
			return testX;
		} else if (test > input.x.max) {
			break;
		} else {
			testX++;
		}
	}
	throw Error("Impossibru !!!");
}

function signFactor(number) {
	if(number > 0) {
		return 1;
	} else if(number < 0) {
		return -1;
	} else {
		return 0;
	}
}

function nextStep({ x, y, xVelocity, yVelocity }) {
	return {
		x: x + xVelocity,
		y: y + yVelocity,
		xVelocity: xVelocity - signFactor(xVelocity),
		yVelocity: yVelocity - 1
	}
}

function computeShotsInTarget(target, startX, startY, minX, maxX, minY, maxY) {
	const validShots = [];
	for(let i = minX; i <= maxX; i++) {
		for(let j = minY; j <= maxY; j++) {
			let step = { x: startX, y: startY, xVelocity: i, yVelocity: j };
			while(step.x < target.x.min || step.y > target.y.max) {
				step = nextStep(step);
			}
			if(step.x <= target.x.max && step.y >= target.y.min) {
				validShots.push([i, j])
			}
		}
	}
	return validShots;
}

const minX = computeMinX(input);
const maxX = input.x.max;
const minY = input.y.min;
const maxY = -(input.y.min+1);

const validShots = computeShotsInTarget(input, 0, 0, minX, maxX, minY, maxY);

console.log(`There are ${validShots.length} valid shots`);