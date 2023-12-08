import { readInput } from '../../utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

const path = data.slice(0, 1).flat()[0];

const map = Object.fromEntries(
  data
    .slice(1)
    .map(([point, , left, right]) => [
      point,
      [left.match(/[A-Z]+/)![0], right.match(/[A-Z]+/)![0]],
    ]),
);

const DIRECTIONS = 'LR';

const objective = 'ZZZ';

let current = 'AAA';

let steps = 0;

let currentPathIndex = 0;

while (current !== objective) {
  current = map[current][DIRECTIONS.indexOf(path[currentPathIndex])];
  steps++;
  currentPathIndex = (currentPathIndex + 1) % path.length;
}

console.log(steps);
