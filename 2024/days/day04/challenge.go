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
	var data grids.Grid = *io.ToStringSlice(input, "")
	countWords := 0
	for i := range data {
		for j := range data[i] {
			countWords += findWords(&data, grids.Coords{X: i, Y: j}, "XMAS")
		}
	}
	return countWords
}

func part2(input *string) int {
	var data grids.Grid = *io.ToStringSlice(input, "")

	countWords := 0

	for i := 1; i < len(data)-1; i++ {
		for j := 1; j < len(data[i])-1; j++ {
			countWords += findCrosswords(&data, grids.Coords{X: i, Y: j}, "MAS")
		}
	}

	return countWords
}

func findWords(grid *grids.Grid, coords grids.Coords, word string) int {
	countWords := 0

dirLoop:
	for direction := range grids.Directions {
		index := 0
		currentCoords := coords

		for index < len(word) {
			if string(word[index]) != grids.GetCharacter(grid, currentCoords) {
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

func findCrosswords(grid *grids.Grid, coords grids.Coords, word string) int {

	if len(word) != 3 {
		return 0
	}

	if grids.GetCharacter(grid, coords) != string(word[1]) {
		return 0
	}

	nwCharacter := grids.GetCharacter(grid, grids.ApplyDirection(coords, grids.NorthWest))
	neCharacter := grids.GetCharacter(grid, grids.ApplyDirection(coords, grids.NorthEast))
	swCharacter := grids.GetCharacter(grid, grids.ApplyDirection(coords, grids.SouthWest))
	seCharacter := grids.GetCharacter(grid, grids.ApplyDirection(coords, grids.SouthEast))

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
