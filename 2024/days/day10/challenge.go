package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"strconv"
	"strings"
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
	dataMap, bounds := parseInput(input)

	trailheads := 0

	for i := 0; i < bounds[0]; i++ {
		for j := 0; j < bounds[1]; j++ {
			if dataMap[grids.Coords{X: i, Y: j}] == 0 {
				trailheads += len(findTrailheadFinishes(&dataMap, bounds, grids.Coords{X: i, Y: j}))
			}
		}
	}

	return trailheads
}

func part2(input *string) int {
	dataMap, bounds := parseInput(input)

	trailheadRatingsTotal := 0

	for i := 0; i < bounds[0]; i++ {
		for j := 0; j < bounds[1]; j++ {
			if dataMap[grids.Coords{X: i, Y: j}] == 0 {
				trailheadsMap := findTrailheadFinishes(&dataMap, bounds, grids.Coords{X: i, Y: j})

				for _, trailheadPaths := range trailheadsMap {
					trailheadRatingsTotal += len(trailheadPaths)
				}
			}
		}
	}

	return trailheadRatingsTotal
}

func parseInput(input *string) (map[grids.Coords]int, [2]int) {

	dataMap := make(map[grids.Coords]int)
	var bounds [2]int

	rows := strings.Split(*input, "\n")
	for i, row := range rows {
		cols := strings.Split(strings.TrimSpace(row), "")

		for j, numStr := range cols {
			if i == 0 && j == 0 {
				bounds = [2]int{len(rows), len(cols)}
			}

			num, err := strconv.Atoi(numStr)
			if err != nil {
				panic(err)
			}
			dataMap[grids.Coords{X: i, Y: j}] = num
		}
	}

	return dataMap, bounds
}

type TrailheadStep struct {
	coords grids.Coords
	path   []grids.Coords
}

func findTrailheadFinishes(dataMap *map[grids.Coords]int, bounds [2]int, coords grids.Coords) map[grids.Coords][][]grids.Coords {

	cellsToVisit := []TrailheadStep{{coords: coords, path: []grids.Coords{coords}}}

	trailheadPaths := make(map[grids.Coords][][]grids.Coords)

	for len(cellsToVisit) > 0 {
		currentCell := cellsToVisit[0]
		cellsToVisit = cellsToVisit[1:]

		if (*dataMap)[currentCell.coords] == 9 {
			trailheadPaths[currentCell.coords] = append(trailheadPaths[currentCell.coords], currentCell.path)
		}

		for _, direction := range [4]grids.Direction{
			grids.North,
			grids.East,
			grids.South,
			grids.West,
		} {
			nextCell := grids.ApplyDirection(currentCell.coords, direction)

			if grids.ValidCoordinates(nextCell, bounds[0], bounds[1]) &&
				(*dataMap)[nextCell] == (*dataMap)[currentCell.coords]+1 {

				cellsToVisit = append(cellsToVisit, TrailheadStep{coords: nextCell, path: append(currentCell.path, nextCell)})
			}
		}
	}

	return trailheadPaths
}
