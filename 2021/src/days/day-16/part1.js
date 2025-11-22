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
		packets.length <= maxPackets
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

			packets.push({ type: "literal", version, value: parseInt(literal.join(''), 2)})
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
			packets.push({ type: "operator", version, value: subPackets});
		}
	}

	return packets;
}

function versionSum(packets) {
	let sum = 0;
	for(const packet of packets) {
		if(packet.type === "literal") {
			sum += packet.version;
		} else {
			sum += packet.version + versionSum(packet.value);
		}
	}
	return sum;
}

const bitSequence = hexa2binary(input);

const packets = parseSequence([...bitSequence.split('')]);

const result = versionSum(packets);

console.log(`Sum of all versions: ${result}`);