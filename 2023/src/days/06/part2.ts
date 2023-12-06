import { readInput } from '../../utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

function computeDistance(totalTime: number, chargeTime: number) {
  return (totalTime - chargeTime) * chargeTime;
}

const [time, distance] = data.map((array) => parseInt(array.slice(1).join('')));

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

const winPossibilities = (Math.floor(time / 2) - min) * 2 - ((time + 1) % 2);

console.log(winPossibilities);
