package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 1, "part 1 or 2")
	flag.Parse()
	fmt.Println("Running part", part)

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
	data := io.ToStringSlice(input, "")
	countWords := 0
	for i := range *data {
		for j := range (*data)[i] {
			countWords += findWords(data, [2]int{i, j}, "XMAS")
		}
	}
	return countWords
}

func part2(input *string) int {
	// data := io.ToStringSlice(input, "")

	return 0
}

type Direction int

const (
	NorthEast Direction = iota
	North
	NorthWest
	West
	SouthWest
	South
	SouthEast
	East
)

var directions = map[Direction][2]int{
	NorthEast: {-1, 1},
	North:     {-1, 0},
	NorthWest: {-1, -1},
	West:      {0, -1},
	SouthWest: {1, -1},
	South:     {1, 0},
	SouthEast: {1, 1},
	East:      {0, 1},
}

func findWords(grid *[][]string, coords [2]int, word string) int {
	countWords := 0

dirLoop:
	for _, direction := range directions {
		index := 0
		currentCoords := coords

		for index < len(word) {
			if (currentCoords[0] < 0 || currentCoords[0] >= len(*grid) ||
				currentCoords[1] < 0 || currentCoords[1] >= len((*grid)[0])) ||
				(string(word[index]) != (*grid)[currentCoords[0]][currentCoords[1]]) {
				continue dirLoop
			} else {
				index++
				currentCoords = [2]int{currentCoords[0] + direction[0], currentCoords[1] + direction[1]}
			}
		}
		countWords++
	}

	return countWords
}
