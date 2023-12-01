import { readInput } from '../../utils/readfile';

const data = await readInput('input.txt');

const sum = data
  .map(([word]) => Array(...(word.match(/\d/g)?.values() ?? [])))
  .filter((row) => row.length > 0)
  .map((row) => [row[0], row[row.length - 1]].join(''))
  .reduce((sum, num) => sum + parseInt(num), 0);

console.log(sum);
