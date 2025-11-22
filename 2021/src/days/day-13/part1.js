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

const foldResult = fold(dots, folds[0]);

console.log(`Dots visible after first fold : ${foldResult.length}`);