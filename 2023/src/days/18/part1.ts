import { readInput } from '@src/utils/readfile';

const data = (await readInput(import.meta.resolveSync('./input.txt'))).map(
  ([direction, distance, color]) =>
    [direction, parseInt(distance), color] as [string, number, string],
);

let current = [0, 0];

const path: [number, number][] = [[0, 0]];
const leftAdd: [number, number][] = [];
const rightAdd: [number, number][] = [];
const minBounds: [number, number] = [0, 0];
const maxBounds: [number, number] = [0, 0];

for (let n = 0; n < data.length; n++) {
  const [direction, distance] = data[n];

  switch (direction) {
    case 'U': {
      path.push(
        ...Array.from(
          new Array(distance),
          (_char, i) => [current[0] - (i + 1), current[1]] as [number, number],
        ),
      );
      if (n > 0 && data[n - 1][0] === 'L') {
        leftAdd.push([current[0] + 1, current[1]]);
        leftAdd.push([current[0], current[1] - 1]);
      }
      if (n > 0 && data[n - 1][0] === 'R') {
        rightAdd.push([current[0] + 1, current[1]]);
        rightAdd.push([current[0], current[1] + 1]);
      }
      current = [current[0] - distance, current[1]];
      minBounds[0] = Math.min(minBounds[0], current[0]);
      break;
    }

    case 'R': {
      path.push(
        ...Array.from(
          new Array(distance),
          (_char, i) => [current[0], current[1] + (i + 1)] as [number, number],
        ),
      );
      if (n > 0 && data[n - 1][0] === 'U') {
        leftAdd.push([current[0], current[1] - 1]);
        leftAdd.push([current[0] - 1, current[1]]);
      }
      if (n > 0 && data[n - 1][0] === 'D') {
        rightAdd.push([current[0], current[1] - 1]);
        rightAdd.push([current[0] + 1, current[1]]);
      }
      current = [current[0], current[1] + distance];
      maxBounds[1] = Math.max(maxBounds[1], current[1]);
      break;
    }

    case 'D': {
      path.push(
        ...Array.from(
          new Array(distance),
          (_char, i) => [current[0] + (i + 1), current[1]] as [number, number],
        ),
      );
      if (n > 0 && data[n - 1][0] === 'L') {
        rightAdd.push([current[0] - 1, current[1]]);
        rightAdd.push([current[0], current[1] - 1]);
      }
      if (n > 0 && data[n - 1][0] === 'R') {
        leftAdd.push([current[0] - 1, current[1]]);
        leftAdd.push([current[0], current[1] + 1]);
      }
      current = [current[0] + distance, current[1]];
      maxBounds[0] = Math.max(maxBounds[0], current[0]);
      break;
    }

    case 'L': {
      path.push(
        ...Array.from(
          new Array(distance),
          (_char, i) => [current[0], current[1] - (i + 1)] as [number, number],
        ),
      );
      if (n > 0 && data[n - 1][0] === 'U') {
        rightAdd.push([current[0], current[1] + 1]);
        rightAdd.push([current[0] - 1, current[1]]);
      }
      if (n > 0 && data[n - 1][0] === 'D') {
        leftAdd.push([current[0], current[1] + 1]);
        leftAdd.push([current[0] + 1, current[1]]);
      }
      current = [current[0], current[1] - distance];
      minBounds[1] = Math.min(minBounds[1], current[1]);
      break;
    }
  }
}

path.splice(path.length - 1, 1);

function key(coords: [number, number]) {
  return coords.join(',');
}

const trenchLength = path.length;

const alreadyDug = new Set([...path.map((coord) => key(coord))]);

const valid = new Set<string>([]);

const inside = [...(leftAdd.length > rightAdd.length ? rightAdd : leftAdd)];

let digs = trenchLength;

while (inside.length > 0) {
  const element = inside.pop()!;
  const [row, col] = element;
  const elementKey = key(element);

  if (alreadyDug.has(elementKey)) {
    continue;
  }

  if (!alreadyDug.has(key([row - 1, col]))) {
    inside.push([row - 1, col]);
  }
  if (!alreadyDug.has(key([row, col + 1]))) {
    inside.push([row, col + 1]);
  }
  if (!alreadyDug.has(key([row + 1, col]))) {
    inside.push([row + 1, col]);
  }
  if (!alreadyDug.has(key([row, col - 1]))) {
    inside.push([row, col - 1]);
  }

  alreadyDug.add(elementKey);
  valid.add(elementKey);
  digs++;
}

console.log(digs);
