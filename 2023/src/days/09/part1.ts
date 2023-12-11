import { readInput } from '@src/utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

const valuesList = data.map((row) => row.map((num) => parseInt(num)));

const nextValues = [];

for (const values of valuesList) {
  const rows = [[...values]];
  let currentRow = rows[0];
  while (currentRow.some((num) => num !== 0)) {
    const newRow = [];
    for (let i = 0; i < currentRow.length - 1; i++) {
      newRow[i] = currentRow[i + 1] - currentRow[i];
    }
    rows.push(newRow);
    currentRow = newRow;
  }
  let startNum = 0;
  for (let i = rows.length - 2; i >= 0; i--) {
    startNum += rows[i][rows[i].length - 1];
  }
  nextValues.push(startNum);
}

const sum = nextValues.reduce((sum, num) => sum + num, 0);

console.log(sum);
