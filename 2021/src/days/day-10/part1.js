import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const chunks = input.flat();

function verifyChunk(chunk) {
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
				if(lastItem !== name) return name;
				break;
			}
			case ")": {
				const name = "parentheses";
				const lastItem = itemStack.pop();
				if(lastItem !== name) return name;
				break;
			}
			case "}": {
				const name = "curly";
				const lastItem = itemStack.pop();
				if(lastItem !== name) return name;
				break;
			}
			case ">": {
				const name = "chevron";
				const lastItem = itemStack.pop();
				if(lastItem !== name) return name;
				break;
			}
		}
	}
	return null;
}

function getItemScore(item) {
	switch (item) {
		case "parentheses": return 3;
		case "square": return 57;
		case "curly": return 1197;
		case "chevron": return 25137;
	}
}

const syntaxErrorScore = chunks
	.map(chunk => verifyChunk(chunk))
	.filter(unexpectedChar => unexpectedChar != null)
	.map(unexpectedChar => getItemScore(unexpectedChar))
	.reduce((acc, curr) => acc + curr, 0);

console.log(`Total syntax error score : ${syntaxErrorScore}.`);