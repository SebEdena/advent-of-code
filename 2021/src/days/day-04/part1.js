import {readFile} from "../../utils/readfile.js";
import {Bingo} from "./bingo.js";

const input = await readFile('./input.txt');

const numbers = input.splice(0, 1)
	.flat()
	.map(value => value.split(','))
	.flat()
	.map(value => parseInt(value));

const bingoBoards = [];

let count = 1;
while(input.length > 0) {
	bingoBoards.push(new Bingo(input.splice(0, Bingo.boardSize), count));
	count++;
}

let currentNumber;
for(let i = 0; i < numbers.length && !(bingoBoards.find(bingoBoard => bingoBoard.isWon)); i++) {
	currentNumber = numbers[i];
	for(const bingoBoard of bingoBoards) {
		bingoBoard.checkNumber(currentNumber);
	}
}

let winner = bingoBoards.find(bingoBoard => bingoBoard.isWon);

if(!winner) {
	console.log('No winner !')
} else {
	let remainingSum = winner.getRemainingValuesSum();

	console.log(`Player ${winner.id} wins !`);
	console.log(winner.toString());
	console.log(`Number=${currentNumber}, Remaining values=${remainingSum}, Result=${currentNumber*remainingSum}`);
}