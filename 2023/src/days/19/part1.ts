import { readInput } from '@src/utils/readfile';

const data = (
  await readInput(import.meta.resolveSync('./input.txt'), { keepEmptyLines: true })
).flat();

type Piece = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Operation = {
  predicate: (piece: Piece) => boolean;
  goTo: string;
};

const stepMap = new Map<string, Operation[]>();

for (let i = 0; i < data.indexOf(''); i++) {
  const key = data[i].slice(0, data[i].indexOf('{'));
  const strSteps = data[i].slice(data[i].indexOf('{') + 1, data[i].indexOf('}')).split(',');
  const steps: Operation[] = [];
  for (const step of strSteps) {
    const [, condition, field, operator, level, destination] =
      /(([x|m|a|s])([<|>])([\d]+):)?([a-zA-Z]+)/g.exec(step) ?? [];
    steps.push({
      predicate: condition ? eval(`(piece) => piece.${field} ${operator} ${level}`) : () => true,
      goTo: destination,
    });
  }
  stepMap.set(key, steps);
}

let result = 0;

if (stepMap.has('in')) {
  for (let i = data.indexOf('') + 1; i < data.length; i++) {
    let currentStep = 'in';
    const piece = JSON.parse(
      data[i].replaceAll('=', ':').replaceAll(/(x|m|a|s)/g, '"$1"'),
    ) as Piece;
    while (!['A', 'R'].includes(currentStep)) {
      const operations = stepMap.get(currentStep)!;
      let stop = false;
      for (const { predicate, goTo } of operations) {
        stop = predicate(piece);
        if (stop) {
          currentStep = goTo;
          break;
        }
      }
    }
    if (currentStep === 'A') result += Object.values(piece).reduce((sum, num) => sum + num);
  }

  console.log(result);
} else {
  console.log("Cannot start : input step 'in' not found !");
}
