import { readInput } from '@src/utils/readfile';

const data = await readInput('input.txt');

const games = data.map((row) => {
  const colorMaps: Map<string, number>[] = [];

  let currentMap = new Map<string, number>([]);
  for (let i = 2; i < row.length; i += 2) {
    const qty = parseInt(row[i]);
    const endMap = row[i + 1].includes(';');
    const color = row[i + 1].match(/[a-z]+/g)?.at(0);
    if (color) {
      currentMap.set(color, qty);
    }
    if (endMap) {
      colorMaps.push(currentMap);
      currentMap = new Map<string, number>([]);
    }
  }

  if (currentMap.size > 0) {
    colorMaps.push(currentMap);
  }

  return colorMaps;
});

const colorsInBag = new Map<string, number>([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

const validGameIds: number[] = [];

loop: for (let i = 0; i < games.length; i++) {
  const game = games[i];

  for (const colorMap of game) {
    for (const [color, qty] of colorsInBag.entries()) {
      if (colorMap.has(color) && colorMap.get(color)! > qty) {
        continue loop;
      }
    }
  }

  validGameIds.push(i + 1);
}

const sum = validGameIds.reduce((sum, current) => sum + current, 0);

console.log(sum);
