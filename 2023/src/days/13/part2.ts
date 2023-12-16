import { readInput } from '@src/utils/readfile';

const data = (
  await readInput(import.meta.resolveSync('./input.txt'), { keepEmptyLines: true })
).flat();

function mirrorMagnitude(pattern: string[], index: number): number {
  let smudgeFixed = false;
  let magnitude = 0;
  for (let i = 0; index - i >= 0 && index + i + 1 < pattern.length; i++) {
    const rowA = pattern[index - i].split('');
    const rowB = pattern[index + i + 1].split('');
    const comparison = rowA.length - rowA.filter((char, i) => rowB[i] === char).length;
    if (comparison === 0) {
      magnitude++;
    } else if (comparison === 1 && !smudgeFixed) {
      smudgeFixed = true;
      magnitude++;
    } else {
      break;
    }
  }
  return smudgeFixed ? magnitude : 0;
}

const patterns: string[][] = [];

let newPattern: string[] = [];

for (const row of data) {
  if (row.length === 0) {
    patterns.push(newPattern);
    newPattern = [];
  } else {
    newPattern.push(row);
  }
}

if (newPattern.length > 0) {
  patterns.push(newPattern);
}

let result = 0;

for (const pattern of patterns) {
  const horizontalLengths: number[] = [];
  for (let i = 0; i < pattern.length - 1; i++) {
    horizontalLengths.push(mirrorMagnitude(pattern, i));
  }

  const verticalLengths: number[] = [];
  const transposed = pattern[0]
    .split('')
    .map((_val, i) => pattern.map((row) => row[i]).reduce((string, char) => string + char, ''));
  for (let i = 0; i < transposed.length - 1; i++) {
    verticalLengths.push(mirrorMagnitude(transposed, i));
  }

  for (let i = 0; i < horizontalLengths.length; i++) {
    if (horizontalLengths[i] === 0) continue;
    if (
      i + 1 - horizontalLengths[i] === 0 ||
      i + horizontalLengths[i] === horizontalLengths.length
    ) {
      result += 100 * (i + 1);
      break;
    }
  }

  for (let i = 0; i < verticalLengths.length; i++) {
    if (verticalLengths[i] === 0) continue;
    if (i + 1 - verticalLengths[i] === 0 || i + verticalLengths[i] === verticalLengths.length) {
      result += i + 1;
      break;
    }
  }
}

console.log(result);
