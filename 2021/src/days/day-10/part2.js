import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const chunks = input.flat();

function verifyAndCompleteChunk(chunk) {
	let itemStack = [];
	for(const char of chunk) {
		switch (char) {
			case "[": itemStack.push("square"); break;
			case "(": itemStack.push("parentheses"); break;
			case "{": itemStack.push("curly"); break;
			case "<": itemStack.push("chevron"); break;
			case "]": {
				const name = "square";
				const lastItem = itemStack.pop();
				if(lastItem !== name) return null;
				break;
			}
			case ")": {
				const name = "parentheses";
				const lastItem = itemStack.pop();
				if(lastItem !== name) return null;
				break;
			}
			case "}": {
				const name = "curly";
				const lastItem = itemStack.pop();
				if(lastItem !== name) return null;
				break;
			}
			case ">": {
				const name = "chevron";
				const lastItem = itemStack.pop();
				if(lastItem !== name) return null;
				break;
			}
		}
	}
	return itemStack.reverse();
}

function getItemScore(items) {
	let totalScore = 0;
	for(const item of items) {
		totalScore *= 5;
		switch (item) {
			case "parentheses": totalScore += 1; break;
			case "square": totalScore += 2; break;
			case "curly": totalScore += 3; break;
			case "chevron": totalScore += 4; break;
		}
	}
	return totalScore;
}

const completedChunksScore = chunks
	.map(chunk => verifyAndCompleteChunk(chunk))
	.filter(missingItems => missingItems != null)
	.map(missingItems => getItemScore(missingItems))
	.sort((a, b) => a - b)

const middleScore = completedChunksScore[Math.floor(completedChunksScore.length / 2)];

console.log(`Middle score : ${middleScore}.`);