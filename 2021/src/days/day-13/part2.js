import {readFile} from "../../utils/readfile.js";

const input = (await readFile('./input.txt'));

const foldIndex = input.findIndex(elt => elt.includes('fold'));

const dots = input.slice(0, foldIndex).flat()
	.map(str => str.split(',').map(str => parseInt(str)));

const folds = input.slice(foldIndex)
	.map(fold => fold[2].split('='))
	.map(([axis, index]) => ({axis, index: parseInt(index)}))

function fold(dots, fold) {
	if(fold.axis === "x") {
		const resultingDots = dots.filter(([x,]) => x < fold.index)
		const dotsToInvert = dots.filter(([x,]) => x > fold.index)
		for(const [x, y] of dotsToInvert) {
			const newX = fold.index - (x - fold.index)
			if(!resultingDots.find(([x2, y2]) => x2 === newX && y2 === y)) {
				resultingDots.push([newX, y])
			}
		}
		return resultingDots;
	} else {
		const resultingDots = dots.filter(([,y]) => y < fold.index)
		const dotsToInvert = dots.filter(([,y]) => y > fold.index)
		for(const [x, y] of dotsToInvert) {
			const newY = fold.index - (y - fold.index)
			if(!resultingDots.find(([x2, y2]) => x2 === x && y2 === newY)) {
				resultingDots.push([x, newY])
			}
		}
		return resultingDots;
	}
}

function draw(dots) {
	let xLimit = 0, yLimit = 0;
	for(const [x, y] of dots) {
		xLimit = Math.max(xLimit, x + 1);
		yLimit = Math.max(yLimit, y + 1);
	}

	let result = [...new Array(yLimit)].map(() => [...new Array(xLimit)].map(() => ' .'));

	for (const [x, y] of dots) {
		result[y][x] = " #";
	}

	for(const row of result) {
		console.log(row.join(''));
	}
}

let foldResult = dots;
for(const foldInstruction of folds) {
	foldResult = fold(foldResult, foldInstruction);
}

draw(foldResult);