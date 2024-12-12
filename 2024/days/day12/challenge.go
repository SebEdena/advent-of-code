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
	grid, bounds := grids.ParseGrid(input)

	plantGroups := clusterPlants(&grid, bounds)

	fenceCost := 0

	for _, plantGroup := range plantGroups {
		area := len(plantGroup)
		perimeter := computePerimeter(&plantGroup)
		fenceCost += area * perimeter
	}

	return fenceCost
}

func part2(input *string) int {
	// grid, bounds := grids.ParseGrid(input)

	return 0
}

func clusterPlants(grid *map[grids.Coords]string, bounds [2]int) []map[grids.Coords]bool {
	plantGroups := make([]map[grids.Coords]bool, 0)
	visitedCells := make(map[grids.Coords]bool)

	for i := 0; i < bounds[0]; i++ {
		for j := 0; j < bounds[1]; j++ {
			coord := grids.Coords{X: i, Y: j}
			if !visitedCells[coord] {
				plants := getPlants(grid, bounds, coord)
				plantGroups = append(plantGroups, plants)

				for k, v := range plants {
					visitedCells[k] = v
				}
			}
		}
	}

	return plantGroups
}

func getPlants(grid *map[grids.Coords]string, bounds [2]int, start grids.Coords) map[grids.Coords]bool {
	character := (*grid)[start]
	directions := []grids.Direction{grids.North, grids.East, grids.South, grids.West}

	if character == "" {
		panic("No plant at start")
	}

	visited := make(map[grids.Coords]bool)
	toVisit := []grids.Coords{start}

	for len(toVisit) > 0 {
		cell := toVisit[0]
		toVisit = toVisit[1:]

		if visited[cell] {
			continue
		}
		visited[cell] = true

		for _, direction := range directions {
			coords := grids.ApplyDirection(cell, direction)
			if grids.ValidCoordinates(coords, bounds[0], bounds[1]) &&
				!visited[coords] && (*grid)[coords] == character {
				toVisit = append(toVisit, coords)
			}
		}
	}

	return visited
}

func computePerimeter(plants *map[grids.Coords]bool) int {
	directions := []grids.Direction{grids.North, grids.East, grids.South, grids.West}
	perimeter := 0

	for plant := range *plants {
		neighbourCount := 0
		for _, dir := range directions {
			neighbour := grids.ApplyDirection(plant, dir)

			if (*plants)[neighbour] {
				neighbourCount++
			}
		}

		perimeter += (4 - neighbourCount)

	}

	return perimeter
}
