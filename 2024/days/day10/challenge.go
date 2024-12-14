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
	grid := grids.ParseGrid(io.ToIntSlice(input, ""))

	trailheads := 0

	for i := 0; i < grid.Rows; i++ {
		for j := 0; j < grid.Cols; j++ {
			if grid.GetElement(grids.Coords{X: i, Y: j}) == 0 {
				trailheads += len(findTrailheadFinishes(&grid, grids.Coords{X: i, Y: j}))
			}
		}
	}

	return trailheads
}

func part2(input *string) int {
	grid := grids.ParseGrid(io.ToIntSlice(input, ""))

	trailheadRatingsTotal := 0

	for i := 0; i < grid.Rows; i++ {
		for j := 0; j < grid.Cols; j++ {
			if grid.GetElement(grids.Coords{X: i, Y: j}) == 0 {
				trailheadsMap := findTrailheadFinishes(&grid, grids.Coords{X: i, Y: j})

				for _, trailheadPaths := range trailheadsMap {
					trailheadRatingsTotal += len(trailheadPaths)
				}
			}
		}
	}

	return trailheadRatingsTotal
}

type TrailheadStep struct {
	coords grids.Coords
	path   []grids.Coords
}

func findTrailheadFinishes(grid *grids.Grid[int], coords grids.Coords) map[grids.Coords][][]grids.Coords {

	cellsToVisit := []TrailheadStep{{coords: coords, path: []grids.Coords{coords}}}

	trailheadPaths := make(map[grids.Coords][][]grids.Coords)

	for len(cellsToVisit) > 0 {
		currentCell := cellsToVisit[0]
		cellsToVisit = cellsToVisit[1:]

		if grid.GetElement(currentCell.coords) == 9 {
			trailheadPaths[currentCell.coords] = append(trailheadPaths[currentCell.coords], currentCell.path)
		}

		for _, direction := range [4]grids.Direction{
			grids.North,
			grids.East,
			grids.South,
			grids.West,
		} {
			nextCell := grids.ApplyDirection(currentCell.coords, direction)

			if grid.ValidCoordinates(nextCell) &&
				grid.GetElement(nextCell) == grid.GetElement(currentCell.coords)+1 {

				cellsToVisit = append(cellsToVisit, TrailheadStep{coords: nextCell, path: append(currentCell.path, nextCell)})
			}
		}
	}

	return trailheadPaths
}
