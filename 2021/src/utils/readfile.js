import { eol } from "../_deps/fs.js";

export async function readFile(file) {
	try {
		const text = await Deno.readTextFile(file)
		let parsedText = [];
		for (let line of text.split(eol.detect(text))) {
			if (line !== "") parsedText.push(line.trim().split(/\s+/));
		}
		return parsedText;
	} catch (err) {
		console.error(err);
	}
}
