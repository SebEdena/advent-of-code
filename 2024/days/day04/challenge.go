package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"flag"
	"fmt"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 1, "part 1 or 2")
	flag.Parse()

	var result int
	if part == 1 {
		result = part1(input)
	} else if part == 2 {
		result = part2(input)
	} else {
		panic("Invalid part")
	}

	fmt.Println(result)
}

func part1(input *string) int {
	data := grids.ParseGrid(io.ToStringSlice(input, ""))

	countWords := 0

	for i := 0; i < data.Rows; i++ {
		for j := 0; j < data.Cols; j++ {
			countWords += findWords(&data, grids.Coords{X: i, Y: j}, "XMAS")
		}
	}

	return countWords
}

func part2(input *string) int {
	data := grids.ParseGrid(io.ToStringSlice(input, ""))

	countWords := 0

	for i := 1; i < data.Rows-1; i++ {
		for j := 1; j < data.Cols-1; j++ {
			countWords += findCrosswords(&data, grids.Coords{X: i, Y: j}, "MAS")
		}
	}

	return countWords
}

func findWords(grid *grids.Grid[string], coords grids.Coords, word string) int {
	countWords := 0

dirLoop:
	for direction := range grids.Directions {
		index := 0
		currentCoords := coords

		for index < len(word) {
			if !grid.ValidCoordinates(currentCoords) || string(word[index]) != grid.GetElement(currentCoords) {
				continue dirLoop
			} else {
				index++
				currentCoords = grids.ApplyDirection(currentCoords, direction)
			}
		}
		countWords++
	}

	return countWords
}

func findCrosswords(grid *grids.Grid[string], coords grids.Coords, word string) int {

	if len(word) != 3 {
		return 0
	}

	if grid.ValidCoordinates(coords) && grid.GetElement(coords) != string(word[1]) {
		return 0
	}

	nwCharacter := grid.GetElement(grids.ApplyDirection(coords, grids.NorthWest))
	neCharacter := grid.GetElement(grids.ApplyDirection(coords, grids.NorthEast))
	swCharacter := grid.GetElement(grids.ApplyDirection(coords, grids.SouthWest))
	seCharacter := grid.GetElement(grids.ApplyDirection(coords, grids.SouthEast))

	var currentCharacter string
	var oppositeCharacter string
	switch nwCharacter {
	case string(word[0]):
		{
			currentCharacter = string(word[0])
			oppositeCharacter = string(word[2])
		}
	case string(word[2]):
		{
			currentCharacter = string(word[2])
			oppositeCharacter = string(word[0])
		}
	default:
		{
			return 0
		}

	}

	if seCharacter == oppositeCharacter &&
		((neCharacter == currentCharacter && swCharacter == oppositeCharacter) ||
			(neCharacter == oppositeCharacter && swCharacter == currentCharacter)) {
		return 1
	} else {
		return 0
	}
}
