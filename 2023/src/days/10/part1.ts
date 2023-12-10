import { readInput } from '../../utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).flat(1);

type Point = {
  x: number;
  y: number;
  pipe: Pipe;
};

enum Orientation {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
}

enum PipeType {
  START = 'START',
  EMPTY = 'EMPTY',
  NORTH_WEST = 'NORTH_WEST',
  NORTH_EAST = 'NORTH_EAST',
  SOUTH_WEST = 'SOUTH_WEST',
  SOUTH_EAST = 'SOUTH_EAST',
  WEST_EAST = 'WEST_EAST',
  NORTH_SOUTH = 'NORTH_SOUTH',
}

type Pipe = { symbol: string; type: PipeType };

const pipes: { [key in PipeType]: Pipe } = {
  [PipeType.START]: { symbol: 'S', type: PipeType.START },
  [PipeType.EMPTY]: { symbol: '.', type: PipeType.EMPTY },
  [PipeType.NORTH_WEST]: { symbol: 'J', type: PipeType.NORTH_WEST },
  [PipeType.NORTH_EAST]: { symbol: 'L', type: PipeType.NORTH_EAST },
  [PipeType.SOUTH_WEST]: { symbol: '7', type: PipeType.SOUTH_WEST },
  [PipeType.SOUTH_EAST]: { symbol: 'F', type: PipeType.SOUTH_EAST },
  [PipeType.WEST_EAST]: { symbol: '-', type: PipeType.WEST_EAST },
  [PipeType.NORTH_SOUTH]: { symbol: '|', type: PipeType.NORTH_SOUTH },
};

const validJunction: { [key in Orientation]: PipeType[] } = {
  [Orientation.NORTH]: [
    PipeType.NORTH_WEST,
    PipeType.NORTH_EAST,
    PipeType.NORTH_SOUTH,
    PipeType.START,
  ],
  [Orientation.EAST]: [
    PipeType.SOUTH_EAST,
    PipeType.NORTH_EAST,
    PipeType.WEST_EAST,
    PipeType.START,
  ],
  [Orientation.SOUTH]: [
    PipeType.SOUTH_WEST,
    PipeType.SOUTH_EAST,
    PipeType.NORTH_SOUTH,
    PipeType.START,
  ],
  [Orientation.WEST]: [
    PipeType.NORTH_WEST,
    PipeType.SOUTH_WEST,
    PipeType.WEST_EAST,
    PipeType.START,
  ],
};

function getAvailableOrientations(x: number, y: number, height: number, width: number) {
  const orientations: Orientation[] = [];
  if (x > 0) orientations.push(Orientation.NORTH);
  if (y < width - 1) orientations.push(Orientation.EAST);
  if (x < height - 1) orientations.push(Orientation.SOUTH);
  if (y > 0) orientations.push(Orientation.WEST);
  return orientations;
}

function getPointAtOrientation(
  point: Point,
  orientation: Orientation,
  points: Point[][],
): Point | undefined {
  switch (orientation) {
    case Orientation.NORTH:
      return points?.[point.x - 1]?.[point.y];
    case Orientation.EAST:
      return points?.[point.x]?.[point.y + 1];
    case Orientation.SOUTH:
      return points?.[point.x + 1]?.[point.y];
    case Orientation.WEST:
      return points?.[point.x]?.[point.y - 1];
  }
}

function reverseOrientation(o: Orientation) {
  switch (o) {
    case Orientation.NORTH:
      return Orientation.SOUTH;
    case Orientation.EAST:
      return Orientation.WEST;
    case Orientation.SOUTH:
      return Orientation.NORTH;
    case Orientation.WEST:
      return Orientation.EAST;
  }
}

let startPoint: Point | undefined = undefined;

const path: Point[] = [];

const rows: Point[][] = [];

for (let i = 0; i < data.length; i++) {
  const row: Point[] = [];
  for (let j = 0; j < data[i].length; j++) {
    const pipe = Object.values(pipes).find(({ symbol }) => symbol === data[i][j]);
    if (pipe) {
      const point: Point = { x: i, y: j, pipe };
      row.push(point);
      if (pipe.type === PipeType.START) {
        startPoint = point;
        path.push(point);
      }
    }
  }
  rows.push(row);
}

let steps: number = -1;
let lastOrientation: Orientation | undefined = undefined;

// eslint-disable-next-line no-constant-condition
mainLoop: while (true) {
  const lastVisited = path.at(-1)!;

  for (const o of getAvailableOrientations(
    lastVisited.x,
    lastVisited.y,
    rows.length,
    rows[0].length,
  )) {
    const or = reverseOrientation(o);
    if (!lastOrientation || lastOrientation !== or) {
      const pt = getPointAtOrientation(lastVisited, o, rows)!;

      if (
        validJunction[or].includes(pt.pipe.type) &&
        validJunction[o].includes(lastVisited.pipe.type)
      ) {
        if (pt == startPoint) {
          steps = Math.floor((path.length + 1) / 2);
          break mainLoop;
        }
        path.push(pt);
        lastOrientation = o;
        continue mainLoop;
      }
    }
  }
}

console.log(steps);
