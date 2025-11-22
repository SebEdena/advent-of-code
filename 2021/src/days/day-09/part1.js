import {readFile} from "../../utils/readfile.js";
import {Heightmap} from "./heightmap.js";

const input = await readFile('./input.txt');

const heightmap = new Heightmap(input.flat().map(row => row.split('').map(str => parseInt(str))));

const totalRiskLevel = heightmap.getTotalRiskLevel();

console.log(`Total of low points risk level: ${totalRiskLevel}`);