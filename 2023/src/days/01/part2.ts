import { readInput } from '../../utils/readfile';

const data = await readInput('input.txt');

interface Occurence {
  digit: number;
  index: number;
}

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function extractDigits(str: string) {
  if (isNaN(parseInt(str))) {
    return findOccurences(
      str,
      digits.filter((d) => str.includes(d)),
    )
      .sort((a, b) => a.index - b.index)
      .map((d) => d.digit);
  } else {
    return str.split('').map((val) => parseInt(val));
  }
}

function findOccurences(src: string, foundDigits: string[]) {
  const occurences: Occurence[] = [];
  for (const digit of foundDigits) {
    const numeric = digits.indexOf(digit) + 1;
    for (let i = 0; i < src.length; i++) {
      const index = src.indexOf(digit, i);
      if (index >= 0) {
        occurences.push({ digit: numeric, index });
        i = index;
      }
    }
  }
  return occurences;
}

const sum = data
  .map(([word]) => Array(...(word.match(/(\d|[a-z]+)/g)?.values() ?? [])))
  .filter((row) => row.length > 0)
  .map((row) => row.map((word) => extractDigits(word)).flat())
  .map((row) => [row[0], row[row.length - 1]])
  .map((row) => parseInt(row.join('')))
  .reduce((sum, num) => sum + num, 0);

console.log(sum);
