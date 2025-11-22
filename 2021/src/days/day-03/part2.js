import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const bitsArray = input.flat();

const bitsNumber = bitsArray[0].length;
let oxygenRatingArray = [...bitsArray];
let carbonRatingArray = [...bitsArray];

function filterRatingArray(ratingArray, index, lookMostFrequentBit=true) {

	let bitToLookAt;
	const [bit0, bit1] = ratingArray
		.map(bitNumber => bitNumber[index])
		.reduce((acc, curr) => { acc[parseInt(curr)]++; return acc }, [0, 0])

	if(lookMostFrequentBit) {
		bitToLookAt = (bit0 > bit1 ? "0": "1");
	} else {
		bitToLookAt = (bit0 > bit1 ? "1": "0");
	}

	return ratingArray.filter(value => value[index] === bitToLookAt);
}

for (let i = 0; i < bitsNumber && !(oxygenRatingArray.length === 1 && carbonRatingArray.length === 1); i++) {
	if(oxygenRatingArray.length > 1) oxygenRatingArray = filterRatingArray(oxygenRatingArray, i, true);
	if(carbonRatingArray.length > 1) carbonRatingArray = filterRatingArray(carbonRatingArray, i, false);
}


const oxygenRating = parseInt(oxygenRatingArray[0], 2);
const carbonRating = parseInt(carbonRatingArray[0], 2);
const lifeSupportRating = oxygenRating * carbonRating;

console.log(`Oxygen rating = ${oxygenRating}, Carbon rating = ${carbonRating}, `
			+ `Life support rating = ${lifeSupportRating}`);