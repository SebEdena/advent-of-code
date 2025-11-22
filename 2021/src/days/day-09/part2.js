import {readFile} from "../../utils/readfile.js";
import {Heightmap} from "./heightmap.js";

const input = await readFile('./input.txt');

const heightmap = new Heightmap(input.flat().map(row => row.split('').map(str => parseInt(str))));

const basinSizes = heightmap.getLowPoints().map(location => location.basinSize()).sort((a, b) => b - a);

const basinsProduct = (basinSizes.length <= 3 ? basinSizes : basinSizes.slice(0, 3))
	.reduce((acc, curr) => acc * curr, 1);

console.log(`Product of top 3 greatest basins: ${basinsProduct}`);