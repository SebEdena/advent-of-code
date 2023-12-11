import { readInput } from '@src/utils/readfile';

const data = await readInput('input.txt');

const symbolRegex = /[^0-9.]/g;
const numberRegex = /\d+/g;

const lines = data.flat(1);

const acceptedNumbers: number[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  let res: RegExpExecArray | null = null;
  numberLoop: while ((res = numberRegex.exec(line))) {
    for (let i2 = Math.max(0, i - 1); i2 <= Math.min(lines.length - 1, i + 1); i2++) {
      for (
        let j2 = Math.max(0, res.index - 1);
        j2 < Math.min(line.length, res.index + res[0].length + 1);
        j2++
      ) {
        if (i === i2 && j2 >= res.index && j2 < res.index + res[0].length) {
          continue;
        } else if (lines[i2].at(j2)!.match(symbolRegex)) {
          acceptedNumbers.push(parseInt(res[0]));
          continue numberLoop;
        }
      }
    }
  }
}

const sum = acceptedNumbers.reduce((sum, num) => sum + num, 0);

console.log(sum);
