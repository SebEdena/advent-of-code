import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const digits = input
	.map(line =>
		({
			input: line.slice(0, 10).map(digitStr => digitStr.split('').sort().join('')),
			output: line.slice(11).map(digitStr => digitStr.split('').sort().join(''))
		})
	);

const lengthOfDigitsToCatch = [2, 3, 4, 7];

let numberOfRecurring1_4_7_8 = 0;

for(const { output } of digits) {
	const localSum = output.filter(digit => lengthOfDigitsToCatch.includes(digit.length)).length;
	numberOfRecurring1_4_7_8 += localSum;
}

console.log(`We encountered the digits ${lengthOfDigitsToCatch} ${numberOfRecurring1_4_7_8} times.`);