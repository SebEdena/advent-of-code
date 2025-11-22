import {readFile} from "../../utils/readfile.js";

const input = (await readFile('./input.txt')).flat()[0];

function hexa2binary(hexString) {
	let result = "";
	for(const hex of hexString) {
		result += parseInt(hex, 16).toString(2).padStart(4, '0');
	}
	return result;
}

function parseSequence(bitSequence, maxPackets=Infinity) {
	const packets = [];

	while(
		bitSequence.length > 0 &&
		bitSequence.includes("1") &&
		packets.length < maxPackets
		) {
		const version = parseInt(bitSequence.splice(0, 3).join(''), 2);
		const type = parseInt(bitSequence.splice(0, 3).join(''), 2);

		if(type === 4) {
			let nextChunk = bitSequence.slice(0, 5);
			let literal = [];
			while(nextChunk[0] === "1") {
				literal.push(...nextChunk.slice(1));
				bitSequence.splice(0, 5);
				nextChunk = bitSequence.slice(0, 5);
			}
			literal.push(...nextChunk.slice(1));
			bitSequence.splice(0, 5);

			packets.push({ type, version, value: parseInt(literal.join(''), 2)})
		} else {
			const lengthType = parseInt(bitSequence.splice(0, 1).join(''), 2);
			const subPackets = [];
			if(lengthType) {
				const subPacketsQuantity = parseInt(bitSequence.splice(0, 11).join(''), 2);
				subPackets.push(...parseSequence(bitSequence, subPacketsQuantity));
			} else {
				const subPacketsLength = parseInt(bitSequence.splice(0, 15).join(''), 2);
				const binarySubData = bitSequence.splice(0, subPacketsLength);
				subPackets.push(...parseSequence(binarySubData));
			}
			packets.push({ type, version, value: subPackets});
		}
	}

	return packets;
}

function evaluateExpression(packet) {
	switch(packet.type) {
		case 0: return packet.value.reduce((acc, curr) => acc + evaluateExpression(curr), 0);
		case 1: return packet.value.reduce((acc, curr) => acc * evaluateExpression(curr), 1);
		case 2: return Math.min(...packet.value.map(elt => evaluateExpression(elt)));
		case 3: return Math.max(...packet.value.map(elt => evaluateExpression(elt)));
		case 4: return packet.value;
		case 5: return evaluateExpression(packet.value[0]) > evaluateExpression(packet.value[1]) ? 1 : 0;
		case 6: return evaluateExpression(packet.value[0]) < evaluateExpression(packet.value[1]) ? 1 : 0;
		case 7: return evaluateExpression(packet.value[0]) === evaluateExpression(packet.value[1]) ? 1 : 0;
	}
}

const bitSequence = hexa2binary(input);

const packets = parseSequence([...bitSequence.split('')]);

const result = evaluateExpression(packets[0]);

console.log(`Result of the expression evaluation : ${result}`);