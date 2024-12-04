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
	data := io.ToStringSlice(input, "")

	countWords := 0

	for i := 1; i < len(*data)-1; i++ {
		for j := 1; j < len((*data)[i])-1; j++ {
			countWords += findCrosswords(data, [2]int{i, j}, "MAS")
		}
	}

	return countWords
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

func applyDirection(coords [2]int, direction Direction) [2]int {
	return [2]int{coords[0] + directions[direction][0], coords[1] + directions[direction][1]}
}

func getCharacter(grid *[][]string, coords [2]int) string {
	if coords[0] < 0 || coords[0] >= len(*grid) || coords[1] < 0 || coords[1] >= len((*grid)[0]) {
		return ""
	}
	return (*grid)[coords[0]][coords[1]]
}

func findWords(grid *[][]string, coords [2]int, word string) int {
	countWords := 0

dirLoop:
	for direction := range directions {
		index := 0
		currentCoords := coords

		for index < len(word) {
			if string(word[index]) != getCharacter(grid, currentCoords) {
				continue dirLoop
			} else {
				index++
				currentCoords = applyDirection(currentCoords, direction)
			}
		}
		countWords++
	}

	return countWords
}

func findCrosswords(grid *[][]string, coords [2]int, word string) int {

	if len(word) != 3 {
		return 0
	}

	if getCharacter(grid, coords) != string(word[1]) {
		return 0
	}

	nwCharacter := getCharacter(grid, applyDirection(coords, NorthWest))
	neCharacter := getCharacter(grid, applyDirection(coords, NorthEast))
	swCharacter := getCharacter(grid, applyDirection(coords, SouthWest))
	seCharacter := getCharacter(grid, applyDirection(coords, SouthEast))

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
