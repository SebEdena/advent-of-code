import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const bitsArray = input.flat();

const bitsNumber = bitsArray[0].length;
let biggerBits = "", lesserBits = "";

for (let i = 0; i < bitsNumber; i++) {
	const [bit0, bit1] = bitsArray
		.map(bitNumber => bitNumber[i])
		.reduce((acc, curr) => { acc[parseInt(curr)]++; return acc }, [0, 0])
	if (bit0 > bit1) {
		biggerBits += "0";
		lesserBits += "1";
	} else {
		biggerBits += "1";
		lesserBits += "0";
	}
}


const gamma = parseInt(biggerBits, 2);
const epsilon = parseInt(lesserBits, 2);
const powerConsumption = gamma * epsilon;

console.log(`gamma = ${gamma}, epsilon = ${epsilon}, power consumption = ${powerConsumption}`);

