import { readInput } from '@src/utils/readfile';

const data = await readInput(import.meta.resolveSync('./input.txt'));

const springs: [string, number[]][] = data.map(([pattern, groups]) => [
  pattern.replace(/([.]+)/g, '.').replace(/([.]+)$/g, ''),
  groups.split(',').map((num) => parseInt(num)),
]);

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
      return findArrangements(pattern.substring(1), record);
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
      return findArrangements(pattern.substring(currentRecord + 1), nextRecords);
    }
    default: {
      // Wildcard met, must split search
      return (
        findArrangements(`#${pattern.substring(1)}`, record) +
        findArrangements(`.${pattern.substring(1)}`, record)
      );
    }
  }
}

const result = springs
  .map(([pattern, groups]) => findArrangements(pattern, groups))
  .reduce((sum, num) => sum + num, 0);

console.log(result);
