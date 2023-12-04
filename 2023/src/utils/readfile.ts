import { detectNewlineGraceful } from 'detect-newline';

export async function readInput(filename: string) {
  const text = await Bun.file(filename).text();
  if (text.length > 0) {
    return text
      .split(detectNewlineGraceful(text))
      .filter((row) => row.length > 0)
      .map((row) => row.split(/[ ]+/));
  } else {
    return [];
  }
}
