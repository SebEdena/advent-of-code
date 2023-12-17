import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).flat();

enum Orientation {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

type Step = {
  h: number;
  heatLoss: number;
  direction: Direction;
  steps: number;
  parent?: Step;
};

type Direction = { row: number; col: number; dir: Orientation };

class PriorityQueue<T> {
  #stack: T[];
  #compare: (itemA: T, itemB: T) => number;

  constructor(compare: (itemA: T, itemB: T) => number) {
    this.#stack = [];
    this.#compare = compare;
  }

  get length() {
    return this.#stack.length;
  }

  enqueue(item: T) {
    let i = 0;
    for (i; i < this.#stack.length; i++) {
      if (this.#compare(item, this.#stack[i]) < 0) {
        break;
      }
    }
    this.#stack.splice(i, 0, item);
  }

  dequeue() {
    if (this.#stack.length > 0) {
      return this.#stack.splice(0, 1)[0];
    } else {
      return undefined;
    }
  }

  has(item: T) {
    return this.#stack.includes(item);
  }
}

function getNeighbours(grid: number[][], direction: Direction) {
  let neighbours: Direction[] = [];

  switch (direction.dir) {
    case Orientation.NORTH: {
      neighbours = [
        { row: direction.row, col: direction.col - 1, dir: Orientation.WEST },
        { row: direction.row - 1, col: direction.col, dir: Orientation.NORTH },
        { row: direction.row, col: direction.col + 1, dir: Orientation.EAST },
      ];
      break;
    }
    case Orientation.EAST: {
      neighbours = [
        { row: direction.row - 1, col: direction.col, dir: Orientation.NORTH },
        { row: direction.row, col: direction.col + 1, dir: Orientation.EAST },
        { row: direction.row + 1, col: direction.col, dir: Orientation.SOUTH },
      ];
      break;
    }
    case Orientation.SOUTH: {
      neighbours = [
        { row: direction.row, col: direction.col + 1, dir: Orientation.EAST },
        { row: direction.row + 1, col: direction.col, dir: Orientation.SOUTH },
        { row: direction.row, col: direction.col - 1, dir: Orientation.WEST },
      ];
      break;
    }
    case Orientation.WEST: {
      neighbours = [
        { row: direction.row + 1, col: direction.col, dir: Orientation.SOUTH },
        { row: direction.row, col: direction.col - 1, dir: Orientation.WEST },
        { row: direction.row - 1, col: direction.col, dir: Orientation.NORTH },
      ];
      break;
    }
  }

  return neighbours.filter(
    ({ row, col }) => row >= 0 && row < grid.length && col >= 0 && col < grid[0].length,
  );
}

function leastHeatLossPathCount(grid: number[][]) {
  const queue = new PriorityQueue<Step>((stepA, stepB) => stepA.h - stepB.h);
  const visited = new Set<string>([]);

  queue.enqueue({
    h: 0,
    direction: { row: 0, col: 0, dir: Orientation.EAST },
    heatLoss: 0,
    steps: 0,
    parent: undefined,
  });
  queue.enqueue({
    h: 0,
    direction: { row: 0, col: 0, dir: Orientation.SOUTH },
    heatLoss: 0,
    steps: 0,
    parent: undefined,
  });

  while (queue.length > 0) {
    const current = queue.dequeue()!;
    const { direction, heatLoss, steps } = current;
    const { row, col, dir } = direction;

    if (row === grid.length - 1 && col === grid[0].length - 1) {
      return heatLoss;
    }

    const nextSteps = getNeighbours(grid, direction).filter((d) =>
      steps > 2 ? d.dir !== dir : true,
    );

    for (const next of nextSteps) {
      const nextStep = {
        h:
          heatLoss +
          grid[next.row][next.col] +
          (grid.length - 1) -
          next.row +
          (grid[0].length - 1) -
          next.col,
        direction: next,
        heatLoss: heatLoss + grid[next.row][next.col],
        steps: next.dir === dir ? steps + 1 : 1,
        parent: current,
      };

      const key = `${next.row}-${next.col}-${next.dir}-${nextStep.steps}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.enqueue(nextStep);
      }
    }
  }

  return [];
}

const grid = data.map((row) =>
  row
    .split('')
    .map((col) => parseInt(col))
    .map((col) => col),
);

const result = leastHeatLossPathCount(grid);

console.log(result);
