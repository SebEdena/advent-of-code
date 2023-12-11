import { readInput } from '@src/utils/readfile';

const data = await readInput('input.txt');

interface Card {
  winning: number[];
  ours: number[];
}

const cards = data.map((row) => {
  return {
    winning: row.slice(2, row.indexOf('|')).map((num) => parseInt(num)),
    ours: row.slice(row.indexOf('|') + 1).map((num) => parseInt(num)),
  } as Card;
});

const cardPoints = cards
  .map((card) => card.winning.filter((num) => card.ours.includes(num)).length)
  .map((validNums) => (validNums > 0 ? 2 ** (validNums - 1) : 0));

const sum = cardPoints.reduce((total, points) => total + points, 0);

console.log(sum);
