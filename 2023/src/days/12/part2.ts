import { readInput } from '@src/utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

const REPETITION = 5;

const springs: [string, number[]][] = data.map(([pattern, groups]) => {
  return [
    new Array(REPETITION)
      .fill(pattern)
      .join('?')
      .replace(/([.]+)/g, '.')
      .replace(/([.]+)$/g, ''),
    Array.from(new Array(REPETITION), () => groups.split(',').map((num) => parseInt(num))).flat(
      1,
    ) as number[],
  ];
});

// Memoisation method taken from
// https://gist.github.com/Nathan-Fenner/781285b77244f06cf3248a04869e7161#file-aoc_2023_day_12-ts-L3
// Because mine was too slow :/
function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result,
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

function findArrangements(pattern: string, record: number[]): number {
  // We reached the end of the pattern
  if (pattern.length === 0) {
    // If the record has no member left, we are done. One possibility
    return record.length === 0 ? 1 : 0;
  }

  // No more record of springs but remaining pattern
  if (record.length === 0) {
    // Pattern still holds at least one broken spring
    return pattern.includes('#') ? 0 : 1;
  }

  // The pattern is shorter than the remaining number of spring separated by one character
  // SUM of records + length of records minus 1
  if (pattern.length < record.reduce((sum, num) => sum + num, record.length - 1)) {
    return 0;
  }

  switch (pattern.charAt(0)) {
    // We can ignore the char and continue to the next one
    case '.': {
      return findArrangementsCache(pattern.substring(1), record);
    }
    // We are in a subpattern of broken springs
    case '#': {
      const [currentRecord, ...nextRecords] = record;
      // We meet a dot earlier than the length of the subpattern
      if (pattern.slice(0, currentRecord).includes('.')) {
        return 0;
      }
      // The subpattern is longer than the expected record
      if (pattern[currentRecord] === '#') {
        return 0;
      }
      // The whole pattern is good, proceed to the next one
      return findArrangementsCache(pattern.substring(currentRecord + 1), nextRecords);
    }
    default: {
      // Wildcard met, must split search
      return (
        findArrangementsCache(`#${pattern.substring(1)}`, record) +
        findArrangementsCache(`.${pattern.substring(1)}`, record)
      );
    }
  }
}

const findArrangementsCache = memoize(findArrangements);

let result = 0;
for (const [pattern, groups] of springs) {
  result += findArrangementsCache(pattern, groups);
}

console.log(result);
