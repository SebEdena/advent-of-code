import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).flat()[0].split(',');

function applyHash(string: string) {
  let value = 0;
  for (const char of string) {
    value = ((value + char.charCodeAt(0)) * 17) % 256;
  }
  return value;
}

const results = data.map((str) => applyHash(str));

const result = results.reduce((sum, num) => sum + num, 0);

console.log(result);
