package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"slices"
	"strconv"
	"strings"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 2, "part 1 or 2")
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
	return computeStrokes(strings.Split(*input, "\n"), 2)
}

func part2(input *string) int {
	return computeStrokes(strings.Split(*input, "\n"), 25)
}

func computeStrokes(codes []string, maxDepth int) int {
	keyPad := buildKeypad(map[string]grids.Coords{
		"7": {X: 0, Y: 0},
		"8": {X: 0, Y: 1},
		"9": {X: 0, Y: 2},
		"4": {X: 1, Y: 0},
		"5": {X: 1, Y: 1},
		"6": {X: 1, Y: 2},
		"1": {X: 2, Y: 0},
		"2": {X: 2, Y: 1},
		"3": {X: 2, Y: 2},
		"0": {X: 3, Y: 1},
		"A": {X: 3, Y: 2},
	})

	dPad := buildKeypad(map[string]grids.Coords{
		"^": {X: 0, Y: 1},
		"A": {X: 0, Y: 2},
		"<": {X: 1, Y: 0},
		"v": {X: 1, Y: 1},
		">": {X: 1, Y: 2},
	})

	keypadMap := computeShortestPaths(&keyPad)
	dpadMap := computeShortestPaths(&dPad)
	cache := make(map[string]int)
	result := 0

	for _, code := range codes {
		list := make([]string, 0)
		buildSequence(keypadMap, code, 0, "A", "", &list)

		var minimum int
		for i, sequence := range list {
			if i == 0 {
				minimum = bestSequence(sequence, maxDepth, dpadMap, cache)
			} else {
				minimum = min(bestSequence(sequence, maxDepth, dpadMap, cache), minimum)
			}
		}
		result += minimum * extractNumber(code)
	}

	return result
}

type Keypad struct {
	symbolToCoords map[string]grids.Coords
	coordsToSymbol map[grids.Coords]string
}

func (k Keypad) IsValidCoords(coords grids.Coords) bool {
	_, ok := k.coordsToSymbol[coords]
	return ok
}

func buildKeypad(pad map[string]grids.Coords) Keypad {
	keypad := Keypad{symbolToCoords: make(map[string]grids.Coords),
		coordsToSymbol: make(map[grids.Coords]string)}

	for key, value := range pad {
		keypad.symbolToCoords[key] = value
		keypad.coordsToSymbol[value] = key
	}

	return keypad
}

func computeShortestPaths(keypad *Keypad) map[string]map[string][]string {

	shortMap := make(map[string]map[string][]string)

	for key, value := range keypad.symbolToCoords {
		for key2, value2 := range keypad.symbolToCoords {
			paths := shortestPaths(*keypad, value, value2)
			if shortMap[key] == nil {
				shortMap[key] = make(map[string][]string)
			}
			shortMap[key][key2] = paths
		}
	}

	return shortMap
}

type Path struct {
	coords  grids.Coords
	strokes string
}

func shortestPaths(keypad Keypad, start, end grids.Coords) []string {

	directions := [4]grids.Direction{grids.North, grids.East, grids.South, grids.West}
	symbols := map[grids.Direction]string{
		grids.North: "^",
		grids.East:  ">",
		grids.South: "v",
		grids.West:  "<",
	}
	toVisit := []Path{{coords: start, strokes: ""}}

	visited := make(map[grids.Coords]int)

	shortestPaths := make([]string, 0)

	for len(toVisit) > 0 {
		current := toVisit[0]
		toVisit = toVisit[1:]

		if current.coords == end {
			if len(shortestPaths) == 0 {
				shortestPaths = append(shortestPaths, current.strokes)
			} else if len(current.strokes) == len(shortestPaths[0]) {
				shortestPaths = append(shortestPaths, current.strokes)
			} else {
				return shortestPaths
			}
		}

		strokeSteps, seen := visited[current.coords]
		if seen && len(current.strokes) > strokeSteps {
			continue
		}

		visited[current.coords] = len(current.strokes)

		for _, dir := range directions {
			nextCoords := grids.ApplyDirection(current.coords, dir)
			if keypad.IsValidCoords(nextCoords) {
				toVisit = append(toVisit, Path{coords: nextCoords, strokes: current.strokes + symbols[dir]})
			}
		}
	}

	return shortestPaths
}

func buildSequence(
	keyMap map[string]map[string][]string,
	keys string, index int,
	previous, currentPath string,
	result *[]string) {

	if index == len(keys) {
		(*result) = append(*result, currentPath)
	} else {
		for _, path := range keyMap[previous][string(keys[index])] {
			buildSequence(keyMap, keys, index+1, string(keys[index]), currentPath+path+"A", result)
		}
	}
}

func bestSequence(keys string, depth int, keyMap map[string]map[string][]string, cache map[string]int) int {
	if depth == 0 {
		return len(keys)
	}
	cachedTotal, inCache := cache[key(keys, depth)]
	if inCache {
		return cachedTotal
	}

	keySplitted := make([]string, 0)
	first := 0
	for i := 0; i < len(keys); i++ {
		if keys[i] == 'A' {
			keySplitted = append(keySplitted, keys[first:i+1])
			first = i + 1
		}
	}

	totalSteps := 0
	for _, sequence := range keySplitted {
		subSequences := make([]string, 0)
		buildSequence(keyMap, sequence, 0, "A", "", &subSequences)

		steps := make([]int, 0)
		for _, subSequence := range subSequences {
			steps = append(steps, bestSequence(subSequence, depth-1, keyMap, cache))
		}

		totalSteps += slices.Min(steps)
	}

	cache[key(keys, depth)] = totalSteps
	return totalSteps

}

func extractNumber(code string) int {
	number, _ := strconv.Atoi(strings.ReplaceAll(code, "A", ""))
	return number
}

func key(path string, depth int) string {
	return fmt.Sprintf("%s-%d", path, depth)
}
