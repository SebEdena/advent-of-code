const resetStr = "\x1b[0m";
const boldStr = "\x1b[22m";
const greenBgStr = "\x1b[42m";
const whiteFgStr = "\x1b[30m";

export class Bingo {

	static boardSize = 5;

	id;
	grid = [];
	checkedIndices = [];
	isWon = false;

	constructor(grid, index) {
		this.id = index;
		grid.forEach(
			row => {
				let tmpRow = [];
				row.forEach(
					column => tmpRow.push(parseInt(column))
				)
				this.grid.push(tmpRow);
			}
		)
	}

	checkNumber(number) {
		for(let i = 0; i < Bingo.boardSize; i++) {
			for (let j = 0; j < Bingo.boardSize; j++) {
				if(this.grid[i][j] === number) {
					this.checkedIndices.push([i, j]);
					this.checkWin(i, j);
					return true;
				}
			}
		}
		return false;
	}

	checkWin(row, column) {
		let checkCountVertical = this.checkedIndices
			.filter(([checkedRow, checkedColumn]) => checkedColumn === column)
			.length;

		let checkCountHorizontal = this.checkedIndices
			.filter(([checkedRow, checkedColumn]) => checkedRow === row)
			.length;

		this.isWon = (checkCountVertical === Bingo.boardSize || checkCountHorizontal === Bingo.boardSize);
		return this.isWon;
	}

	toString() {
		let result = "";
		for (let i = 0; i < Bingo.boardSize; i++) {
			for (let j = 0; j < Bingo.boardSize; j++) {
				let numberStr = String(this.grid[i][j]).padStart(4, ' ');
				if (this.checkedIndices.find(([checkedRow, checkedColumn]) => checkedRow === i && checkedColumn === j)) {
					numberStr = boldStr + greenBgStr + whiteFgStr + numberStr + resetStr;
				}
				result += numberStr;
			}
			result += "\n";
		}
		return result;
	}

	getRemainingValuesSum() {
		let sum = 0;
		for (let i = 0; i < Bingo.boardSize; i++) {
			for (let j = 0; j < Bingo.boardSize; j++) {
				let value = this.checkedIndices.find(([checkedRow, checkedColumn]) => checkedRow === i && checkedColumn === j);
				if(!value) {
					sum += this.grid[i][j];
				}
			}
		}
		return sum;
	}
}