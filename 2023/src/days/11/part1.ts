import { readInput } from '../../utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).flat();

type Point = {
  x: number;
  y: number;
};

function manhattanGalactic(a: Point, b: Point, filledRows: Set<number>, filledCols: Set<number>) {
  const x = Math.abs(b.x - a.x);
  const xExtension = Array(x)
    .fill(0)
    .map((_, i) => (filledCols.has(Math.min(a.x, b.x) + i + 1) ? 0 : 1) as number)
    .reduce((sum, num) => sum + num, 0);
  const y = Math.abs(b.y - a.y);
  const yExtension = Array(y)
    .fill(0)
    .map((_, i) => (filledRows.has(Math.min(a.y, b.y) + i + 1) ? 0 : 1) as number)
    .reduce((sum, num) => sum + num, 0);
  return x + xExtension + y + yExtension;
}

const filledRows = new Set<number>();
const filledCols = new Set<number>();

const galaxies: Point[] = [];

for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data[i].length; j++) {
    if (data[i][j] === '#') {
      galaxies.push({ x: j, y: data.length - i - 1 });
      filledRows.add(data.length - i - 1);
      filledCols.add(j);
    }
  }
}

let totalDistance = 0;

for (let i = 0; i < galaxies.length; i++) {
  for (let j = i + 1; j < galaxies.length; j++) {
    totalDistance += manhattanGalactic(galaxies[i], galaxies[j], filledRows, filledCols);
  }
}

console.log(totalDistance);
