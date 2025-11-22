import {readFile} from "../../utils/readfile.js";

const input = await readFile('./input.txt');

const edges = input.flat().map(edge => edge.split('-'));

const nodes = new Set(edges.flat());

function getPaths(edges, nodes) {
	const finalPaths = [];
	return explorePath("start", []);

	function getAdjacentNodes(node) {
		return edges
			.filter(edge => edge.includes(node))
			.map(edge => edge.filter(node2 => node !== node2))
			.flat();
	}

	function nodeIsEligible(node, path) {
		if(node === "start") return false;
		if(node.toLowerCase() === node) {
			const visitedSmallCaves = [...path.filter(node => node.toLowerCase() === node && !["start", "end"].includes(node)), node];
			return visitedSmallCaves
				.filter(smallCave =>
					visitedSmallCaves.indexOf(smallCave) !== visitedSmallCaves.lastIndexOf(smallCave)
				).length <= 2;
		}
		return true;
	}

	function explorePath(node, path = []) {
		path.push(node);
		for(const adjacentNode of getAdjacentNodes(node)) {
			if(adjacentNode === "end") {
				finalPaths.push([...path, adjacentNode]);
			} else {
				if(nodeIsEligible(adjacentNode, path)) {
					explorePath(adjacentNode, path)
				}
			}
		}
		path.pop();
		return finalPaths;
	}
}

const paths = getPaths(edges, nodes);

console.log(`You have ${paths.length} possible paths.`);