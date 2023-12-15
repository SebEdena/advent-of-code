import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).flat()[0].split(',');

type Lens = {
  label: string;
  focal: number;
};

function applyHash(string: string) {
  let value = 0;
  for (const char of string) {
    value = ((value + char.charCodeAt(0)) * 17) % 256;
  }
  return value;
}

const boxMap = new Map<number, Lens[]>([]);

for (const step of data) {
  const [label, instruction, focal] = Array.from(step.matchAll(/^([a-z]+)(=|-)(\d){0,1}$/g))
    .flat()
    .slice(1);

  const boxNumber = applyHash(label);
  if (!boxMap.has(boxNumber)) {
    boxMap.set(boxNumber, []);
  }

  const box = boxMap.get(boxNumber)!;
  const sameLensIndex = box.findIndex((l) => l.label === label);

  if (instruction === '-') {
    if (sameLensIndex >= 0) {
      box.splice(sameLensIndex, 1);
    }
  } else {
    const lens = { label, focal: parseInt(focal) };
    if (sameLensIndex >= 0) {
      box.splice(sameLensIndex, 1, lens);
    } else {
      box.push(lens);
    }
  }
}

const result = Array.from(boxMap.entries())
  .map(([box, lenses]) => {
    return lenses
      .map((lens, i) => (box + 1) * (i + 1) * lens.focal)
      .reduce((sum, num) => sum + num, 0);
  })
  .reduce((sum, num) => sum + num, 0);

console.log(result);
