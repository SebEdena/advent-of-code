import {readFile} from "../../utils/readfile.js";
import {Node} from "./node.js";

const input = (await readFile('./input.txt'))
	.flat()
	.map(row => row.split('').map(col => parseInt(col)));

const sizeFactor = 5;
const xSize = input.length, ySize = input[0].length, xGlobalSize = xSize * sizeFactor, yGlobalSize = ySize * sizeFactor;

function euclideanDistance(node1, node2) {
	return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
}

function generateGrid(gridTemplate, startX, startY, increment) {
	const grid = [];

	for(let i = 0; i < xSize; i++) {
		const row = [];
		for(let j = 0; j < ySize; j++) {
			let potentialRisk = (input[i][j] + increment);
			potentialRisk = potentialRisk > 9 ? potentialRisk - 9 : potentialRisk;
			row.push(
				new Node(
					i + xSize * startX,
					j + ySize * startY,
					potentialRisk
				)
			);
		}
		grid.push(row);
	}

	return grid;
}

function aStarSearch(grids, start, finish, heuristic) {

	function successors(node) {
		 const potentialCoordinates = [
			 [node.x - 1, node.y],
			 [node.x, node.y + 1],
			 [node.x + 1, node.y],
			 [node.x, node.y - 1],
		 ]

		return potentialCoordinates
			.filter(([x, y]) => (x >= 0 && x < xGlobalSize && y >= 0 && y < yGlobalSize))
			.map(([x, y]) => {
				const globalX = Math.floor(x / xSize), globalY = Math.floor(y / ySize);
				let grid = grids.find(gridObj => gridObj.x === globalX && gridObj.y === globalY)?.grid;
				if (!grid) {
					grid = generateGrid(input, globalX, globalY, globalX + globalY);
					if (globalX === sizeFactor - 1 && globalY === sizeFactor - 1) {
						finish.localRisk = grid[xSize - 1][ySize - 1].localRisk;
						grid[xSize - 1][ySize - 1] = finish;
					}
					grids.push({x: globalX, y: globalY, grid})
				}
				return grid[x - globalX * xSize][y - globalY * ySize];
			});
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

const grid = generateGrid(input, 0, 0, 0);

const grids = [ { x: 0, y: 0, grid } ]
const start = grid[0][0];
const finish = new Node(
	xGlobalSize - 1,
	yGlobalSize - 1,
	0
);

const path = aStarSearch(grids, start, finish, euclideanDistance);

if(path && path.length > 0) {
	const result = path[path.length - 1].f;
	console.log(`Lowest risk level : ${result}`);
} else {
	console.log('No path can be built.');
}