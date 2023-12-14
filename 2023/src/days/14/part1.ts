import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt')))
  .flat()
  .map((row) => row.split(''));

enum Direction {
  NORTH,
  WEST,
  SOUTH,
  EAST,
}

interface TiltParam {
  firstAxisStart: number;
  firstAxisEnd: number;
  secondAxisStart: number;
  secondAxisEnd: number;
  get: (panel: string[][], first: number, second: number, gap?: number) => string;
  set: (panel: string[][], first: number, second: number, char: string, gap?: number) => string;
  increment: (num: number, quantity?: number) => number;
}

function printString(panel: string[][]) {
  return '\r\n' + panel.map((row) => row.join('')).join('\n') + '\r\n';
}

function getTiltParams(direction: Direction, panel: string[][]): TiltParam {
  switch (direction) {
    case Direction.NORTH:
      return {
        firstAxisStart: 0,
        firstAxisEnd: panel[0].length,
        secondAxisStart: 0,
        secondAxisEnd: panel.length,
        get: (panel, first, second, gap = 0) => panel[second - gap][first],
        set: (panel, first, second, char, gap = 0) => (panel[second - gap][first] = char),
        increment: (num, quantity = 1) => num + quantity,
      };
    case Direction.WEST:
      return {
        firstAxisStart: 0,
        firstAxisEnd: panel.length,
        secondAxisStart: 0,
        secondAxisEnd: panel[0].length,
        get: (panel, first, second, gap = 0) => panel[first][second - gap],
        set: (panel, first, second, char, gap = 0) => (panel[first][second + gap] = char),
        increment: (num, quantity = 1) => num + quantity,
      };
    case Direction.SOUTH:
      return {
        firstAxisStart: panel[0].length,
        firstAxisEnd: 0,
        secondAxisStart: panel.length,
        secondAxisEnd: 0,
        get: (panel, first, second, gap = 0) => panel[second + gap][first],
        set: (panel, first, second, char, gap = 0) => (panel[second + gap][first] = char),
        increment: (num, quantity = 1) => num - quantity,
      };
    case Direction.EAST:
      return {
        firstAxisStart: panel.length,
        firstAxisEnd: 0,
        secondAxisStart: panel[0].length,
        secondAxisEnd: 0,
        get: (panel, first, second, gap = 0) => panel[first][second + gap],
        set: (panel, first, second, char, gap = 0) => (panel[first][second + gap] = char),
        increment: (num, quantity = 1) => num - quantity,
      };
  }
}

function tilt(panel: string[][], direction: Direction) {
  const newPanel: string[][] = structuredClone(panel);
  const { firstAxisStart, firstAxisEnd, secondAxisStart, secondAxisEnd, get, set, increment } =
    getTiltParams(direction, panel);
  for (let first = firstAxisStart; first < firstAxisEnd; first = increment(first)) {
    let gap = 0;
    for (let second = secondAxisStart; second < secondAxisEnd; second = increment(second)) {
      switch (get(panel, first, second)) {
        case 'O': {
          if (gap !== 0) {
            set(newPanel, first, second, '.');
            set(newPanel, first, second, 'O', gap);
          }
          break;
        }
        case '.':
          gap = increment(gap);
          break;
        case '#':
          gap = 0;
          break;
      }
    }
  }
  return newPanel;
}

function northLoad(panel: string[][]) {
  let load = 0;
  for (let i = 0; i < panel.length; i++) {
    for (let j = 0; j < panel[0].length; j++) {
      const element = panel[i][j];
      if (element === 'O') {
        load += panel.length - i;
      }
    }
  }
  return load;
}

const tn = tilt(data, Direction.NORTH);

console.log(northLoad(tn));
