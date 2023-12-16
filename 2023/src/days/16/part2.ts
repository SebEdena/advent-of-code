import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).flat();

enum Orientation {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

type Point = { row: number; column: number };

type Direction = { point: Point; orientation: Orientation };

function nextTiles(grid: string[][], direction: Direction): Direction[] {
  const { point, orientation } = direction;
  const offsetRow = orientation % 2 === 0 ? -1 + 2 * Math.floor(orientation / 2) : 0;
  const offsetColumn = orientation % 2 === 1 ? 1 - 2 * Math.floor(orientation / 2) : 0;

  let nextTiles: Direction[] = [];
  switch (grid[point.row][point.column]) {
    case '.': {
      nextTiles = [
        { point: { row: point.row + offsetRow, column: point.column + offsetColumn }, orientation },
      ];
      break;
    }
    case '-': {
      if (orientation % 2 === 0) {
        nextTiles = [
          { point: { row: point.row, column: point.column - 1 }, orientation: Orientation.WEST },
          { point: { row: point.row, column: point.column + 1 }, orientation: Orientation.EAST },
        ];
      } else {
        nextTiles = [
          {
            point: { row: point.row + offsetRow, column: point.column + offsetColumn },
            orientation: orientation,
          },
        ];
      }
      break;
    }
    case '|': {
      if (orientation % 2 === 0) {
        nextTiles = [
          {
            point: { row: point.row + offsetRow, column: point.column + offsetColumn },
            orientation: orientation,
          },
        ];
      } else {
        nextTiles = [
          { point: { row: point.row - 1, column: point.column }, orientation: Orientation.NORTH },
          { point: { row: point.row + 1, column: point.column }, orientation: Orientation.SOUTH },
        ];
      }
      break;
    }
    case '/': {
      nextTiles = [
        {
          point: { row: point.row - offsetColumn, column: point.column - offsetRow },
          orientation: Math.floor(orientation / 2) * 2 + ((orientation + 1) % 2),
        },
      ];
      break;
    }
    case '\\': {
      nextTiles = [
        {
          point: { row: point.row + offsetColumn, column: point.column + offsetRow },
          orientation: ((Math.floor(orientation / 2) + 1) % 2) * 2 + ((orientation + 1) % 2),
        },
      ];
      break;
    }
  }

  return nextTiles.filter(
    ({ point }) =>
      point.row >= 0 &&
      point.row < grid.length &&
      point.column >= 0 &&
      point.column < grid[0].length,
  );
}

function addToMap(pathMap: Map<string, Set<Orientation>>, d: Direction) {
  const key = `${d.point.row}+${d.point.column}`;
  if (!pathMap.has(key)) {
    pathMap.set(key, new Set<Orientation>());
  }
  pathMap.get(key)!.add(d.orientation);
}

function getEnergizedCount(grid: string[][], startDirection: Direction) {
  const pathMap = new Map<string, Set<Orientation>>();
  const toVisit: Direction[] = [];

  toVisit.push({
    point: { row: startDirection.point.row, column: startDirection.point.column },
    orientation: startDirection.orientation,
  });

  while (toVisit.length > 0) {
    const current = toVisit.splice(0, 1)[0];
    addToMap(pathMap, current);

    for (const tile of nextTiles(grid, current)) {
      if (!pathMap.get(`${tile.point.row}+${tile.point.column}`)?.has(tile.orientation)) {
        toVisit.splice(0, 0, tile);
      }
    }
  }

  return Array.from(pathMap.keys()).length;
}

const grid = data.map((row) => row.split(''));

let bestScore = 0;

for (let i = 0; i < grid.length; i++) {
  const east = getEnergizedCount(grid, {
    point: { row: i, column: 0 },
    orientation: Orientation.EAST,
  });
  const west = getEnergizedCount(grid, {
    point: { row: i, column: grid[0].length - 1 },
    orientation: Orientation.EAST,
  });
  bestScore = Math.max(bestScore, east, west);
}

for (let j = 0; j < grid[0].length; j++) {
  const south = getEnergizedCount(grid, {
    point: { row: 0, column: j },
    orientation: Orientation.SOUTH,
  });
  const north = getEnergizedCount(grid, {
    point: { row: grid.length - 1, column: j },
    orientation: Orientation.SOUTH,
  });
  bestScore = Math.max(bestScore, south, north);
}

console.log(bestScore);
