import { readInput } from '../../utils/readfile';

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

const powers: number[] = [];

for (const game of games) {
  const totalMap = new Map<string, number>([]);
  for (const colorMap of game) {
    for (const [color, qty] of colorMap.entries()) {
      if (!totalMap.has(color)) {
        totalMap.set(color, qty);
      } else {
        totalMap.set(color, Math.max(totalMap.get(color)!, qty));
      }
    }
  }

  powers.push([...totalMap.values()].reduce((product, qty) => product * qty, 1));
}

const sum = powers.reduce((sum, current) => sum + current, 0);

console.log(sum);
