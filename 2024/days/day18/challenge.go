package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"strconv"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 2, "part 1 or 2")
	flag.Parse()

	var result string
	if part == 1 {
		result = strconv.Itoa(part1(input))
	} else if part == 2 {
		result = part2(input)
	} else {
		panic("Invalid part")
	}

	fmt.Println(result)
}

func part1(input *string) int {
	walls := io.ToIntSlice(input, ",")

	byteMap := make(map[grids.Coords]bool)
	for i := 0; i < len(*walls) && i < 1024; i++ {
		byteMap[grids.Coords{X: (*walls)[i][1], Y: (*walls)[i][0]}] = true
	}

	start := grids.Coords{X: 0, Y: 0}
	end := grids.Coords{X: 70, Y: 70}
	bounds := [2]int{71, 71}

	steps := findShortestPath(start, end, bounds, &byteMap)

	return steps
}

func part2(input *string) string {
	walls := io.ToIntSlice(input, ",")

	byteMap := make(map[grids.Coords]bool)
	for i := 0; i < len(*walls) && i < 1024; i++ {
		byteMap[grids.Coords{X: (*walls)[i][1], Y: (*walls)[i][0]}] = true
	}

	start := grids.Coords{X: 0, Y: 0}
	end := grids.Coords{X: 70, Y: 70}
	bounds := [2]int{71, 71}

	for i := 1024; i < len(*walls); i++ {
		wallCoords := grids.Coords{X: (*walls)[i][1], Y: (*walls)[i][0]}
		byteMap[wallCoords] = true
		steps := findShortestPath(start, end, bounds, &byteMap)
		if steps < 0 {
			return fmt.Sprintf("%d,%d", wallCoords.Y, wallCoords.X)
		}
	}

	panic("No blocking byte found!")
}

type Step struct {
	element grids.Coords
	steps   int
}

func findShortestPath(start, end grids.Coords, bounds [2]int, walls *map[grids.Coords]bool) int {

	toVisit := []Step{{element: start, steps: 0}}
	visitedMap := make(map[grids.Coords]bool)

	for len(toVisit) > 0 {
		current := toVisit[0]
		toVisit = toVisit[1:]

		if visitedMap[current.element] {
			continue
		}

		if current.element == end {
			return current.steps
		}

		for _, direction := range [4]grids.Direction{grids.North, grids.East, grids.South, grids.West} {
			successor := grids.ApplyDirection(current.element, direction)
			if grids.ValidCoordinates(successor, bounds[0], bounds[1]) && !(*walls)[successor] && !visitedMap[successor] {
				toVisit = append(toVisit, Step{element: successor, steps: current.steps + 1})
			}
		}

		visitedMap[current.element] = true
	}

	return -1
}
