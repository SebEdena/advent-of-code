import { readInput } from '../../utils/readfile';

const data = await readInput('input.txt');

interface Mapping {
  source: number;
  destination: number;
  range: number;
}

const seeds = data[0].slice(1).map((seed) => parseInt(seed));

const steps: Mapping[][] = [];

let currentStep: Mapping[] = [];

for (let i = 1; i < data.length; i++) {
  const row = data[i];
  if (isNaN(parseInt(row[0]))) {
    if (currentStep.length > 0) {
      steps.push(currentStep);
      currentStep = [];
    }
  } else {
    const [destination, source, range] = row.map((num) => parseInt(num));
    currentStep.push({
      destination,
      source,
      range,
    });
    if (i === data.length - 1) {
      steps.push(currentStep);
    }
  }
}

for (const step of steps) {
  for (let i = 0; i < seeds.length; i++) {
    for (const { source, destination, range } of step) {
      if (seeds[i] >= source && seeds[i] < source + range) {
        seeds[i] = destination + (seeds[i] - source);
        break;
      }
    }
  }
}

const lowestLocation = seeds.sort((a, b) => a - b)?.[0];

console.log(lowestLocation);
