import {readFile} from "../../utils/readfile.js";

const input = (await readFile('./input.txt'));

const steps = 40;

const template = input.slice(0, 1).flat()[0]

const polymers = input
	.slice(1, input.length)
	.map(([pair, , result]) => [pair, result])
	.reduce((obj, [pair, result]) => {obj[pair] = result; return obj}, {})

const pairsCount = Object.fromEntries(
	Object.entries(polymers).map(([pair,]) => [pair, 0])
);

for(let i = 0; i < template.length - 1; i++){
	const pre = template.charAt(i), post = template.charAt(i+1);
	pairsCount[pre + post]++;
}

for(let i = 0; i < steps; i++){
	const preStepCount = JSON.parse(JSON.stringify(pairsCount));
	for(const pair of Object.keys(polymers)) {
		const pairCount = preStepCount[pair];
		pairsCount[pair] -= pairCount;
		pairsCount[pair[0] + polymers[pair]] += pairCount;
		pairsCount[polymers[pair] + pair[1]] += pairCount;
	}
}

let templateCount = Object.fromEntries(
	Array.from([...new Set(Object.values(polymers))]).map(letter => [letter, 0])
);
for(const pair of Object.keys(pairsCount)) {
	templateCount[pair[0]] += pairsCount[pair] / 2;
	templateCount[pair[1]] += pairsCount[pair] / 2;
}
templateCount = Object.fromEntries(
	Object.entries(templateCount)
		.map(([element, occurences]) => [element, Math.round(occurences)])
);

const results = Object.values(templateCount).sort((a, b) => a - b)

const computedDifference = results[results.length - 1] - results[0];

console.log(`Most occuring element - Least occuring element = ${computedDifference}`);