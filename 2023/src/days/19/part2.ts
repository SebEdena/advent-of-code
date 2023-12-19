import { readInput } from '@src/utils/readfile';

const data = (
  await readInput(import.meta.resolveSync('./input.txt'), { keepEmptyLines: true })
).flat();

type PieceRange = Record<string, { min: number; max: number }>;

type Operation = {
  field: string;
  operator: string;
  criterion: number;
  goTo: string;
};

const stepMap = new Map<string, Operation[]>();

for (let i = 0; i < data.indexOf(''); i++) {
  const key = data[i].slice(0, data[i].indexOf('{'));
  const strSteps = data[i].slice(data[i].indexOf('{') + 1, data[i].indexOf('}')).split(',');
  const steps: Operation[] = [];
  for (const step of strSteps) {
    const [, , field, operator, level, destination] =
      /(([x|m|a|s])([<|>])([\d]+):)?([a-zA-Z]+)/g.exec(step) ?? [];
    steps.push({
      field: field ?? '',
      operator: operator ?? 'skip',
      criterion: parseInt(level ?? -1),
      goTo: destination,
    });
  }
  stepMap.set(key, steps);
}

if (stepMap.has('in')) {
  const records: { pieces: PieceRange; step: string; operation: number }[] = [
    {
      pieces: {
        x: { min: 1, max: 4000 },
        m: { min: 1, max: 4000 },
        a: { min: 1, max: 4000 },
        s: { min: 1, max: 4000 },
      },
      step: 'in',
      operation: 0,
    },
  ];
  while (records.some((r) => !['A', 'R'].includes(r.step))) {
    for (let record of records) {
      if (['A', 'R'].includes(record.step)) {
        continue;
      }
      const operation = stepMap.get(record.step)![record.operation];
      if (operation.operator === 'skip') {
        record.step = operation.goTo;
        record.operation = 0;
      } else if (
        operation.criterion >= record.pieces[operation.field].min ||
        operation.criterion <= record.pieces[operation.field].max
      ) {
        switch (operation.operator) {
          case '>': {
            const newRecord = structuredClone(record);
            newRecord.step = operation.goTo;
            newRecord.operation = 0;
            newRecord.pieces[operation.field].min = operation.criterion + 1;
            records.push(newRecord);

            record.pieces[operation.field].max = operation.criterion;
            record.operation++;
            break;
          }
          case '<': {
            const newRecord = structuredClone(record);
            newRecord.step = operation.goTo;
            newRecord.operation = 0;
            newRecord.pieces[operation.field].max = operation.criterion - 1;
            records.push(newRecord);

            record.pieces[operation.field].min = operation.criterion;
            record.operation++;
            break;
          }
        }
      } else {
        record.operation++;
      }
    }
  }

  let result = 0;
  for (let record of records.filter((r) => r.step === 'A')) {
    result += Object.values(record.pieces).reduce(
      (product, { min, max }) => (max + 1 - min) * product,
      1,
    );
  }

  console.log(result);
} else {
  console.log("Cannot start : input step 'in' not found !");
}
