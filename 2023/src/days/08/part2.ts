import { readInput } from '@src/utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

const path = data.slice(0, 1).flat()[0];

const map = Object.fromEntries(
  data
    .slice(1)
    .map(([point, , left, right]) => [
      point,
      [left.match(/[0-9A-Z]+/)![0], right.match(/[0-9A-Z]+/)![0]],
    ]),
);

const DIRECTIONS = 'LR';

type PrimeFactorElement = { divisor: number; count: number };

function primeFactors(n: number) {
  const factors: PrimeFactorElement[] = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      const obj = factors.find((f) => f.divisor === divisor);
      if (obj) {
        obj.count++;
      } else {
        factors.push({ divisor, count: 1 });
      }
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

const startNodes = Object.keys(map).filter((key) => key.endsWith('A'));

const currentNodes = [...startNodes];

let steps = 0;

let currentPathIndex = 0;

const cycles = Array(currentNodes.length)
  .fill(0)
  .map(() => ({
    firstFinishIndex: -1,
    cycleLength: -1,
  }));

while (!cycles.every((cycle) => cycle.cycleLength >= 0)) {
  const direction = DIRECTIONS.indexOf(path[currentPathIndex]);
  for (let i = 0; i < currentNodes.length; i++) {
    const node = currentNodes[i];
    const cycle = cycles[i];
    if (cycle.cycleLength >= 0) {
      continue;
    }
    const nextNode = map[node][direction];
    if (nextNode.endsWith('Z')) {
      if (cycle.firstFinishIndex >= 0) {
        cycle.cycleLength = steps + 1 - cycle.firstFinishIndex;
      } else {
        cycle.firstFinishIndex = steps + 1;
      }
    }
    currentNodes[i] = nextNode;
  }
  steps++;
  currentPathIndex = (currentPathIndex + 1) % path.length;
}

const cyclesPrimeFactors = cycles.map(({ cycleLength }) => primeFactors(cycleLength));

const lcmMap: PrimeFactorElement[] = [];

for (const cycle of cyclesPrimeFactors) {
  for (const cycleDivisor of cycle) {
    const divisor = lcmMap.find((i) => i.divisor === cycleDivisor.divisor);
    if (divisor) {
      divisor.count = Math.max(divisor.count, cycleDivisor.count);
    } else {
      lcmMap.push({ ...cycleDivisor });
    }
  }
}

const lcm = lcmMap.reduce((product, { divisor, count }) => product * divisor ** count, 1);

console.log(lcm);
