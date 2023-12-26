import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).flat();

interface Point {
  row: number;
  col: number;
}

interface Step extends Point {
  remaining: number;
}

interface Garden {
  walls: Record<string, boolean>;
  plots: Record<string, number>;
  start: Point;
  height: number;
  width: number;
}

function key(row: number, col: number) {
  return `${row},${col}`;
}

function parseInput(data: string[][]) {
  const plots: Record<string, number> = {};
  const walls: Record<string, boolean> = {};
  let start: Point = { row: 0, col: 0 };
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      switch (data[i][j]) {
        case '#': {
          walls[key(i, j)] = true;
          break;
        }
        case 'S': {
          plots[key(i, j)] = -1;
          start = { row: i, col: j };
          break;
        }
      }
    }
  }
  return {
    walls,
    plots,
    start,
    height: data.length,
    width: data[0].length,
  };
}

function getNextSteps(garden: Garden, i: number, j: number, remaining: number): Step[] {
  const k = key(i, j);

  if (garden.plots[k] >= remaining) {
    return [];
  }

  garden.plots[k] = remaining;

  if (remaining > 0) {
    const steps: Step[] = [];
    if (i > 0 && !garden.walls[key(i - 1, j)])
      steps.push({ row: i - 1, col: j, remaining: remaining - 1 });
    if (j < garden.width - 1 && !garden.walls[key(i, j + 1)])
      steps.push({ row: i, col: j + 1, remaining: remaining - 1 });
    if (i < garden.height - 1 && !garden.walls[key(i + 1, j)])
      steps.push({ row: i + 1, col: j, remaining: remaining - 1 });
    if (j > 0 && !garden.walls[key(i, j - 1)])
      steps.push({ row: i, col: j - 1, remaining: remaining - 1 });
    return steps;
  }

  return [];
}

const TARGET = 64;
const garden = parseInput(data.flat().map((row) => row.split('')));
const { start } = garden;

const toVisit: Step[] = [{ row: start.row, col: start.col, remaining: TARGET }];

while (toVisit.length > 0) {
  const { row, col, remaining } = toVisit.shift()!;
  toVisit.push(...getNextSteps(garden, row, col, remaining));
}

console.log(Object.values(garden.plots).filter((s) => s % 2 === 0).length);
