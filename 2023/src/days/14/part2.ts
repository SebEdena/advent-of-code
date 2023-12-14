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
  condition: (i: number, end: number) => boolean;
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
        condition: (i: number, end: number) => i < end,
      };
    case Direction.WEST:
      return {
        firstAxisStart: 0,
        firstAxisEnd: panel.length,
        secondAxisStart: 0,
        secondAxisEnd: panel[0].length,
        get: (panel, first, second, gap = 0) => panel[first][second - gap],
        set: (panel, first, second, char, gap = 0) => (panel[first][second - gap] = char),
        increment: (num, quantity = 1) => num + quantity,
        condition: (i: number, end: number) => i < end,
      };
    case Direction.SOUTH:
      return {
        firstAxisStart: panel[0].length - 1,
        firstAxisEnd: 0,
        secondAxisStart: panel.length - 1,
        secondAxisEnd: 0,
        get: (panel, first, second, gap = 0) => panel[second - gap][first],
        set: (panel, first, second, char, gap = 0) => (panel[second - gap][first] = char),
        increment: (num, quantity = 1) => num - quantity,
        condition: (i: number, end: number) => i >= end,
      };
    case Direction.EAST:
      return {
        firstAxisStart: panel.length - 1,
        firstAxisEnd: 0,
        secondAxisStart: panel[0].length - 1,
        secondAxisEnd: 0,
        get: (panel, first, second, gap = 0) => panel[first][second - gap],
        set: (panel, first, second, char, gap = 0) => (panel[first][second - gap] = char),
        increment: (num, quantity = 1) => num - quantity,
        condition: (i: number, end: number) => i >= end,
      };
  }
}

function tilt(panel: string[][], direction: Direction) {
  const newPanel: string[][] = structuredClone(panel);
  const {
    firstAxisStart,
    firstAxisEnd,
    secondAxisStart,
    secondAxisEnd,
    get,
    set,
    increment,
    condition,
  } = getTiltParams(direction, panel);
  for (let first = firstAxisStart; condition(first, firstAxisEnd); first = increment(first)) {
    let gap = 0;
    for (
      let second = secondAxisStart;
      condition(second, secondAxisEnd);
      second = increment(second)
    ) {
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

const MAX_CYCLES = 1_000_000_000;

let panel = structuredClone(data);
let cycles = 0;
const loads: number[] = [];

let result = -1;

mainLoop: while (cycles < MAX_CYCLES) {
  // Perform a full cycle
  for (let i = 0; i < 4; i++) {
    panel = tilt(panel, i);
  }

  const load = northLoad(panel);
  const lastId = loads.lastIndexOf(load);
  loads.push(load);

  // If we already encountered the last load before
  if (lastId >= 0) {
    // Detect if we are doing a cycle
    let i = 0;
    while (i < loads.length - 1 - lastId) {
      if (loads[lastId - 1 - i] === loads[loads.length - 2 - i]) {
        i++;
      } else {
        break;
      }
    }

    // There is a cycle, so we fast forward to the future cycles
    if (i === loads.length - 1 - lastId) {
      const patternLength = i;
      // Index 0 of the pattern will start here
      const startCycle = Math.floor(MAX_CYCLES / patternLength) * patternLength;

      // We keep the indices in the pattern, start at the cycle with a shift of modulo patternLength,
      // because the pattern does not start at patternLength * x
      result = loads
        .slice(lastId)
        .map((val, i) => ({ value: val, index: (lastId % patternLength) + i + startCycle }))
        .filter(({ index }) => index === MAX_CYCLES - 1)[0].value;

      break mainLoop;
    }
  }

  cycles++;
}

if (result < 0) {
  result = loads[loads.length - 1];
}

console.log(result);
