import { readInput } from '../../utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

interface Mapping {
  source: number;
  destination: number;
  range: number;
}

interface Seed {
  start: number;
  qty: number;
  end: number;
}

let seeds: Seed[] = [];

for (let i = 1; i < data[0].length; i += 2) {
  const [start, qty] = data[0].slice(i, i + 2).map((num) => parseInt(num));
  seeds.push({ start, qty, end: start + qty });
}

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
    const { start, qty, end } = seeds[i];
    for (const { source, destination, range } of step) {
      if (start >= source && start < source + range - 1) {
        const startSeed = destination + (start - source);
        if (start + qty <= source + range) {
          seeds[i] = { ...seeds[i], start: startSeed, end: startSeed + qty };
        } else {
          const newSeeds: Seed[] = [];

          newSeeds.push(
            {
              start: startSeed,
              qty: source + range - start,
              end: startSeed + (source + range - start),
            },
            {
              start: start + (source + range - start),
              qty: qty - (source + range - start),
              end: start + qty,
            },
          );
          seeds = [...seeds.slice(0, i), ...newSeeds, ...seeds.slice(i + 1)];
        }
        break;
      } else if (end - 1 >= source && end - 1 < source + range) {
        const startSeed = destination;
        if (start >= source) {
          seeds[i] = { ...seeds[i], start: startSeed, end: startSeed + qty };
        } else {
          const newSeeds: Seed[] = [];

          newSeeds.push(
            {
              start: startSeed,
              qty: end - source,
              end: startSeed + end - source,
            },
            {
              start: start,
              qty: qty - (end - source),
              end: start + qty - (end - source),
            },
          );
          seeds = [...seeds.slice(0, i), ...newSeeds, ...seeds.slice(i + 1)];
        }
        break;
      }
    }
  }
}

const lowestLocation = seeds.sort((a, b) => a.start - b.start)?.[0].start;

console.log(lowestLocation);
