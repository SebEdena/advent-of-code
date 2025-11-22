import {readFile} from "../../utils/readfile.js";
import {Node} from "./node.js";

const input = (await readFile('./input.txt')).flat();

function stringToArray(stringTree) {
	let level = 0, splitLevel = 1;
	if(!isNaN(parseInt(stringTree))) {
		return parseInt(stringTree);
	}
	for(let i = 0; i < stringTree.length; i++) {
		if(stringTree.charAt(i) === "[") {
			level++;
		}
		if(stringTree.charAt(i) === "]") {
			level--;
		}
		if(stringTree.charAt(i) === ",") {
			if(level === splitLevel) {
				return [
					stringToArray(stringTree.slice(1, i)),
					stringToArray(stringTree.slice(i+1, stringTree.length - 1))
				];
			}
		}
	}
}

function arrayToTree(arrayTree, parent) {
	if(typeof arrayTree === "number" || arrayTree.every(element => typeof element === "number")) {
		return new Node(parent, arrayTree, null, null);
	} else {
		const node = new Node(parent, null, null, null);
		node.left = arrayToTree(arrayTree[0], node);
		node.right = arrayToTree(arrayTree[1], node);
		return node;
	}
}

function flattenTree(node) {
	if(node.value != null) {
		return [node];
	} else {
		return [...flattenTree(node.left), ...flattenTree(node.right)];
	}
}

function findClosest(node, flatList) {
	const nodeIndex = flatList.indexOf(node);
	if(nodeIndex >= 0) {
		return {
			left: nodeIndex === 0 ? null : flatList[nodeIndex - 1],
			right: nodeIndex === flatList.length - 1 ? null : flatList[nodeIndex + 1]
		}
	} else {
		return {
			left: null,
			right: null
		}
	}
}

function explode(node, flatList, level) {
	if(node.value != null) {
		if(level === 4 && typeof node.value === "object") {
			const closest = findClosest(node, flatList);
			if(closest.left) {
				if(typeof closest.left.value === "number") {
					closest.left.value += node.value[0];
				} else {
					closest.left.value[1] += node.value[0];
				}
			}
			if(closest.right) {
				if(typeof closest.right.value === "number") {
					closest.right.value += node.value[1];
				} else {
					closest.right.value[0] += node.value[1];
				}
			}
			node.value = 0;
			if(typeof node.parent.left.value === typeof node.parent.right.value) {
				node.parent.value = [node.parent.left.value, node.parent.right.value];
				node.parent.left = node.parent.right = null;
			}
			return (!!closest.left || !!closest.right);
		} else {
			return false;
		}
	} else {
		return explode(node.left, flatList, level + 1) ||
			explode(node.right, flatList,level + 1);
	}
}

function simplify(node, flatList) {
	const toSimplify = flatList.find(node =>
		(typeof node.value === "number" && node.value > 9) ||
		(typeof node.value === "object" && node.value.find(value => value > 9))
	);
	if(toSimplify) {
		if(typeof toSimplify.value === "number") {
			toSimplify.value = [Math.floor(toSimplify.value / 2), Math.ceil(toSimplify.value / 2)];
		} else {
			const indexToSplit = toSimplify.value.findIndex(value => value > 9);
			const newPair = [
				Math.floor(toSimplify.value[indexToSplit] / 2),
				Math.ceil(toSimplify.value[indexToSplit] / 2)
			];
			if(indexToSplit === 0) {
				toSimplify.left = new Node(toSimplify, newPair, null, null);
				toSimplify.right = new Node(toSimplify, toSimplify.value[1], null, null);
				toSimplify.value = null;
			} else {
				toSimplify.left = new Node(toSimplify, toSimplify.value[0], null, null);
				toSimplify.right = new Node(toSimplify, newPair, null, null);
				toSimplify.value = null;
			}
		}
		return true;
	} else {
		return false;
	}
}

function sumTrees(treeA, treeB) {
	const newTree = new Node(null, null, treeA, treeB);
	treeA.parent = newTree;
	treeB.parent = newTree;

	let flatList = flattenTree(newTree);
	let reducible = true;
	while(reducible) {
		let explodeHappened = false, simplifyHappened = false;
		explodeHappened = explode(newTree, flatList, 0);
		if(!explodeHappened) {
			simplifyHappened = simplify(newTree, flatList);
		}
		flatList = flattenTree(newTree);
		reducible = explodeHappened || simplifyHappened;
	}

	return newTree;
}

function computeMagnitude(node) {
	if(node.value) {
		if(typeof node.value === "number") {
			return node.value;
		} else {
			return 3*node.value[0] + 2*node.value[1];
		}
	} else {
		return 3*computeMagnitude(node.left) + 2*computeMagnitude(node.right);
	}
}

let tree = arrayToTree(stringToArray(input[0]), null);
for(let i = 1; i < input.length; i++) {
	tree = sumTrees(tree, arrayToTree(stringToArray(input[i]), null));
}

const result = computeMagnitude(tree);

console.log(`Magnitude of the result : ${result}`);