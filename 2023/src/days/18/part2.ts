/*
  Thanks to reddit and github user https://github.com/rtrinh3 for explaining
  Using Pick's theorem and shoelace formula to solve this since my part 1 is too naive...
  Pick : Area = Content + Perimeter/2 - 1
  Shoelace : Area = ABS(Sum(xi*yj - xi*yj) for each edge starting at i and ending at j)
  Area = Interior + Perimeter
  So by swapping the equation
  Interior = Area + Perimeter / 2 + 1
*/

import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).map(([, , color]) => {
  const [, distance, direction] = Array.from(/([0-9a-z]{5})(\d{1})/g.exec(color)!);

  return [['R', 'D', 'L', 'U'][parseInt(direction)], parseInt(distance, 16), color] as [
    string,
    number,
    string,
  ];
});

type Point = {
  row: number;
  column: number;
};

type Edge = {
  start: Point;
  end: Point;
};

function computeEnd(start: Point, distance: number, direction: string): Point {
  switch (direction) {
    case 'U':
      return { row: start.row - distance, column: start.column };
    case 'R':
      return { row: start.row, column: start.column + distance };
    case 'D':
      return { row: start.row + distance, column: start.column };
    case 'L':
      return { row: start.row, column: start.column - distance };
    default:
      return start;
  }
}

function lavaVolume(edges: Edge[]) {
  const perimeter = edges
    .map(({ start, end }) => Math.abs(end.row - start.row) + Math.abs(end.column - start.column))
    .reduce((sum, distance) => sum + distance, 0);
  const area = polyArea(edges);
  return area + perimeter / 2 + 1;
}

function polyArea(edges: Edge[]) {
  let area = 0;
  for (const { start, end } of edges) {
    area += start.row * end.column - end.row * start.column;
  }
  return Math.abs(area / 2);
}

let current = { row: 0, column: 0 };

const edges: Edge[] = [];

for (let edge of data) {
  const [direction, distance] = edge;
  const end = computeEnd(current, distance, direction);
  edges.push({ start: current, end: end });
  current = end;
}

const volume = lavaVolume(edges);

console.log(volume);
