import { detectNewlineGraceful } from 'detect-newline';

const DEFAULT_OPTIONS: ReadOptions = {
  keepEmptyLines: false,
};

export type ReadOptions = {
  keepEmptyLines: boolean;
};

export async function readInput(filename: string, options: Partial<ReadOptions> = DEFAULT_OPTIONS) {
  const { keepEmptyLines } = { ...DEFAULT_OPTIONS, ...options };
  const text = await Bun.file(filename).text();

  if (text.length > 0) {
    return text
      .split(detectNewlineGraceful(text))
      .filter((row) => (keepEmptyLines ? true : row.length > 0))
      .map((row) => row.split(/[ ]+/));
  } else {
    return [];
  }
}
