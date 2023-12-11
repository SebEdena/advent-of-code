import { readInput } from '@src/utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

interface Race {
  time: number;
  distance: number;
}

function computeDistance(totalTime: number, chargeTime: number) {
  return (totalTime - chargeTime) * chargeTime;
}

const [times, distances] = data.map((array) => array.slice(1).map((str) => parseInt(str)));

const races: Race[] = [];

for (let i = 0; i < times.length; i++) {
  races.push({ time: times[i], distance: distances[i] });
}

const winPossibilities: number[] = [];

for (const { time, distance } of races) {
  let min = 0,
    max = Math.floor(time / 2);
  while (max - min > 1) {
    const chargeTime = Math.floor((min + max) / 2);
    const raceDistance = computeDistance(time, chargeTime);
    if (raceDistance > distance) {
      max = chargeTime;
    } else {
      min = chargeTime;
    }
  }

  winPossibilities.push((Math.floor(time / 2) - min) * 2 - ((time + 1) % 2));
}

const product = winPossibilities.reduce((product, num) => product * num, 1);

console.log(product);
