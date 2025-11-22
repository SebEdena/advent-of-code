import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const digits = input
	.map(line =>
		({
			input: line.slice(0, 10).map(digitStr => digitStr.split('').sort().join('')),
			output: line.slice(11).map(digitStr => digitStr.split('').sort().join(''))
		})
	);

const digitsReference = {
	"abcefg": 0,
	"cf": 1,
	"acdeg": 2,
	"acdfg": 3,
	"bcdf": 4,
	"abdfg": 5,
	"abdefg": 6,
	"acf": 7,
	"abcdefg": 8,
	"abcdfg": 9
}

function frequencyOfSegments(digitsArray) {
	return digitsArray
		.map(str => str.split(''))
		.reduce(
			(acc, curr) =>
				curr.reduce(
					(acc, curr) => { acc[curr]++; return acc },
					acc
				),
			Object.fromEntries("abcdefg".split('').map(letter => [letter, 0]))
		);
}

function determineUniqueSegments(segmentsArray) {
	return Object.fromEntries(
		Object.entries(segmentsArray)
			.filter(([, value]) => {
				return Object.entries(segmentsArray)
					.filter(([, value2]) => value === value2)
					.length === 1;
			})
	);
}

function assignLetter(mapping, realLetter, fakeLetter) {
	for(const [letter] of Object.keys(mapping)) {
		if(letter === realLetter) {
			mapping[letter] = [fakeLetter];
		} else {
			mapping[letter] = mapping[letter].filter(otherLetter => otherLetter !== fakeLetter);
		}
	}
}

function diff(array1, array2) {
	const diff = [];
	diff.push(...array1.filter(elt => !array2.includes(elt)));
	diff.push(...array2.filter(elt => !array1.includes(elt)));
	return diff;
}

const segmentsFrequency = frequencyOfSegments(Object.keys(digitsReference));
const uniqueSegments = determineUniqueSegments(segmentsFrequency);

let resultSum = 0;

for(const { input, output } of digits) {
	const mapping = Object.fromEntries(
		"abcdefg".split('').map(text => [text, "abcdefg".split('')])
	);
	const localFrequency = frequencyOfSegments(input);
	const localUnique = determineUniqueSegments(localFrequency);

	Object.entries(localUnique).forEach(
		([fakeLetter, fakeFrequency]) => {
			const [realLetter,] = Object.entries(uniqueSegments)
				.find(([, realFrequency]) => realFrequency === fakeFrequency)[0]
			assignLetter(mapping, realLetter, fakeLetter);
		})

	const digit1 = input.filter(str => str.length === 2)[0];
	const digit4 = input.filter(str => str.length === 4)[0];
	const digit7 = input.filter(str => str.length === 3)[0];

	assignLetter(mapping, 'c', diff(digit1.split(''), mapping['f'])[0]);
	assignLetter(mapping, 'a', diff(digit1.split(''), digit7.split(''))[0]);
	assignLetter(mapping, 'd', diff([...digit1.split(''), mapping['b'][0]], digit4.split(''))[0])

	const invertedMapping = Object.fromEntries(
		Object.entries(mapping)
			.map(([realLetter, fakeLetters]) => [fakeLetters[0], realLetter])
	);

	let resultNumberString = "";
	for(const mysteriousNumberString of output) {
		const realMapping = mysteriousNumberString
			.split('')
			.map(fakeLetter => invertedMapping[fakeLetter])
			.sort()
			.join('')
		const number = digitsReference[realMapping];
		resultNumberString += number;
	}
	resultSum += parseInt(resultNumberString);
}

console.log(`The total sum of numbers is ${resultSum}`);