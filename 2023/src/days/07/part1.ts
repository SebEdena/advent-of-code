import { readInput } from '@src/utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

const CARDS_ORDER = '23456789TJQKA';

enum Type {
  HIGH_CARD = 0,
  ONE_PAIR = 1,
  TWO_PAIRS = 2,
  THREE_KIND = 3,
  FULL_HOUSE = 4,
  FOUR_KIND = 5,
  FIVE_KIND = 6,
}

function getHandType(hand: string) {
  const symbols = Object.entries(
    hand.split('').reduce((obj, symbol) => {
      obj[symbol] = (obj[symbol] ?? 0) + 1;
      return obj;
    }, {} as { [symbol: string]: number }),
  )
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count);

  switch (symbols[0].count) {
    case 5:
      return Type.FIVE_KIND;
    case 4:
      return Type.FOUR_KIND;
    case 3:
      return symbols[1].count === 2 ? Type.FULL_HOUSE : Type.THREE_KIND;
    case 2:
      return symbols[1].count === 2 ? Type.TWO_PAIRS : Type.ONE_PAIR;
    default:
      return Type.HIGH_CARD;
  }
}

const hands = data
  .map(([hand, bid]) => ({ hand, bid: parseInt(bid), type: getHandType(hand) }))
  .sort((h1, h2) => {
    const typeSort = h1.type - h2.type;
    if (typeSort === 0) {
      let symbolSort = 0;
      for (let i = 0; i < 5 && symbolSort === 0; i++) {
        symbolSort = CARDS_ORDER.indexOf(h1.hand.at(i)!) - CARDS_ORDER.indexOf(h2.hand.at(i)!);
      }
      return symbolSort;
    } else {
      return typeSort;
    }
  });

const winnings = hands.reduce((win, { bid }, rank) => win + bid * (rank + 1), 0);

console.log(winnings);
