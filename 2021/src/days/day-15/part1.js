import {readFile} from "../../utils/readfile.js";
import {Node} from "./node.js";

const input = (await readFile('./input.txt'))
	.flat()
	.map(row => row.split('').map(col => parseInt(col)));

function euclideanDistance(node1, node2) {
	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
}

function aStarSearch(grid, start, finish, heuristic) {

	function successors(node) {
		 const potentialCoordinates = [
			 [node.x - 1, node.y],
			 [node.x, node.y + 1],
			 [node.x + 1, node.y],
			 [node.x, node.y - 1],
		 ]

		return potentialCoordinates
			.filter(([x, y]) => (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length))
			.map(([x, y]) => grid[x][y])
	}

	function backtrack() {
		let current = finish;
		const path = [];
		do {
			path.splice(0, 0, current)
			current = current.parent;
		} while(current);
		return path;
	}

	start.risk = 0;
	start.f = heuristic(start, finish);
	const openList = [start];

	while(openList.length > 0) {
		const current = openList.splice(0, 1)[0];
		if(current === finish) {
			return backtrack();
		}
		const successorNodes = successors(current);
		for(const successorNode of successorNodes) {
			const potentialRisk = current.risk + successorNode.localRisk;
			if(potentialRisk < successorNode.risk) {
				successorNode.risk = potentialRisk;
				successorNode.f = potentialRisk + heuristic(successorNode, finish);
				successorNode.parent = current;

				if(!openList.includes(successorNode)) {
					const insertIndex = openList.findIndex((node) => node.f > successorNode.f) ?? openList.length;
					openList.splice(insertIndex, 0, successorNode);
				}
			}
		}
	}

	return null;
}

const grid = [];

for(let i = 0; i < input.length; i++) {
	const row = [];
	for(let j = 0; j < input[0].length; j++) {
		row.push(new Node(i, j, input[i][j]));
	}
	grid.push(row);
}

const path = aStarSearch(grid, grid[0][0], grid[grid.length - 1][grid[0].length - 1], euclideanDistance);

if(path && path.length > 0) {
	const result = path[path.length - 1].f;
	console.log(`Lowest risk level : ${result}`);
} else {
	console.log('No path can be built.');
}