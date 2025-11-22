import {readFile} from "../../utils/readfile.js";
import {Bingo} from "./bingo.js";

const input = await readFile('./input.txt');

const numbers = input.splice(0, 1)
	.flat()
	.map(value => value.split(','))
	.flat()
	.map(value => parseInt(value));

let bingoBoards = [];

let count = 1;
while(input.length > 0) {
	bingoBoards.push(new Bingo(input.splice(0, Bingo.boardSize), count));
	count++;
}

let currentNumber;
let loserBoard;
for(let i = 0; i < numbers.length && !loserBoard; i++) {
	currentNumber = numbers[i];
	for(const bingoBoard of bingoBoards) {
		bingoBoard.checkNumber(currentNumber);
		if(bingoBoard.isWon) {
			if(bingoBoards.length > 1) {
				bingoBoards = bingoBoards.filter(bingoBoard2 => bingoBoard2.id !== bingoBoard.id);
			} else {
				loserBoard = bingoBoard;
			}
		}
	}
}

if(!loserBoard) {
	console.log('There is always one loser, check again !')
} else {
	let remainingSum = loserBoard.getRemainingValuesSum();

	console.log(`Loser board is #${loserBoard.id} !`);
	console.log(loserBoard.toString());
	console.log(`Number=${currentNumber}, Remaining values=${remainingSum}, Result=${currentNumber*remainingSum}`);
}