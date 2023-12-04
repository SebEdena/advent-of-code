import { readInput } from '../../utils/readfile';

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

const cardPoints = cards.map(
  (card) => card.winning.filter((num) => card.ours.includes(num)).length,
);

const totalOfCards = Array<number>(cards.length).fill(1);

for (let i = 0; i < cards.length; i++) {
  for (let j = 1; j <= cardPoints[i]; j++) {
    totalOfCards[i + j] += totalOfCards[i];
  }
}

const sum = totalOfCards.reduce((total, points) => total + points, 0);

console.log(sum);
