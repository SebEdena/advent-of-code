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
	grid := grids.ParseGrid(io.ToStringSlice(input, ""))

	plantGroups := clusterPlants(&grid)

	fenceCost := 0

	for _, plantGroup := range plantGroups {
		area := len(plantGroup.plantMap)
		perimeter := computePerimeter(&plantGroup.plantMap)
		fenceCost += area * perimeter
	}

	return fenceCost
}

func part2(input *string) int {
	grid := grids.ParseGrid(io.ToStringSlice(input, ""))

	plantGroups := clusterPlants(&grid)

	fenceCost := 0

	for _, plantGroup := range plantGroups {
		area := len(plantGroup.plantMap)
		sides := computeSides(&plantGroup)
		fenceCost += area * sides
	}

	return fenceCost
}

type PlantGroup struct {
	plantMap   map[grids.Coords]bool
	firstPlant grids.Coords
	limits     [2]grids.Coords
}

func clusterPlants(grid *grids.Grid[string]) []PlantGroup {
	plantGroups := make([]PlantGroup, 0)
	visitedCells := make(map[grids.Coords]bool)

	for i := 0; i < grid.Rows; i++ {
		for j := 0; j < grid.Cols; j++ {
			coord := grids.Coords{X: i, Y: j}
			if !visitedCells[coord] {
				plants, limits := getPlants(grid, coord)
				plantGroups = append(plantGroups, PlantGroup{
					plantMap: plants, firstPlant: coord, limits: limits})

				for k, v := range plants {
					visitedCells[k] = v
				}
			}
		}
	}

	return plantGroups
}

func getPlants(grid *grids.Grid[string], start grids.Coords) (map[grids.Coords]bool, [2]grids.Coords) {
	character := grid.GetElement(start)
	directions := [4]grids.Direction{grids.North, grids.East, grids.South, grids.West}

	if character == "" {
		panic("No plant at start")
	}

	visited := make(map[grids.Coords]bool)
	toVisit := []grids.Coords{start}

	minX := start.X
	minY := start.Y
	maxX := start.X
	maxY := start.Y

	for len(toVisit) > 0 {
		cell := toVisit[0]

		minX = min(minX, cell.X)
		minY = min(minY, cell.Y)
		maxX = max(maxX, cell.X)
		maxY = max(maxY, cell.Y)

		toVisit = toVisit[1:]

		if visited[cell] {
			continue
		}
		visited[cell] = true

		for _, direction := range directions {
			coords := grids.ApplyDirection(cell, direction)
			if grid.ValidCoordinates(coords) &&
				!visited[coords] && grid.GetElement(coords) == character {
				toVisit = append(toVisit, coords)
			}
		}
	}

	return visited, [2]grids.Coords{{X: minX, Y: minY}, {X: maxX, Y: maxY}}
}

func computePerimeter(plants *map[grids.Coords]bool) int {
	directions := [4]grids.Direction{grids.North, grids.East, grids.South, grids.West}
	perimeter := 0

	for plant := range *plants {
		neighbours := 0
		for _, dir := range directions {
			neighbour := grids.ApplyDirection(plant, dir)

			if (*plants)[neighbour] {
				neighbours++
			}
		}

		perimeter += (4 - neighbours)
	}

	return perimeter
}

func computeSides(plants *PlantGroup) int {
	sides := 0

	// North
	for i := plants.limits[0].X; i <= plants.limits[1].X; i++ {
		for j := plants.limits[0].Y; j <= plants.limits[1].Y; j++ {
			coords := grids.Coords{X: i, Y: j}
			if plants.plantMap[coords] &&
				!plants.plantMap[grids.ApplyDirection(coords, grids.North)] {
				nextCell := grids.Coords{X: i, Y: j + 1}
				for plants.plantMap[nextCell] && !plants.plantMap[grids.ApplyDirection(nextCell, grids.North)] {
					j++
					nextCell.Y++
				}
				sides++
			}
		}
	}

	// East
	for j := plants.limits[0].Y; j <= plants.limits[1].Y; j++ {
		for i := plants.limits[0].X; i <= plants.limits[1].X; i++ {
			coords := grids.Coords{X: i, Y: j}
			if plants.plantMap[coords] &&
				!plants.plantMap[grids.ApplyDirection(coords, grids.East)] {
				nextCell := grids.Coords{X: i + 1, Y: j}
				for plants.plantMap[nextCell] && !plants.plantMap[grids.ApplyDirection(nextCell, grids.East)] {
					i++
					nextCell.X++
				}
				sides++
			}
		}
	}

	// South
	for i := plants.limits[1].X; i >= plants.limits[0].X; i-- {
		for j := plants.limits[1].Y; j >= plants.limits[0].Y; j-- {
			coords := grids.Coords{X: i, Y: j}
			if plants.plantMap[coords] &&
				!plants.plantMap[grids.ApplyDirection(coords, grids.South)] {
				nextCell := grids.Coords{X: i, Y: j - 1}
				for plants.plantMap[nextCell] && !plants.plantMap[grids.ApplyDirection(nextCell, grids.South)] {
					j--
					nextCell.Y--
				}
				sides++
			}
		}
	}

	// West
	for j := plants.limits[1].Y; j >= plants.limits[0].Y; j-- {
		for i := plants.limits[1].X; i >= plants.limits[0].X; i-- {
			coords := grids.Coords{X: i, Y: j}
			if plants.plantMap[coords] &&
				!plants.plantMap[grids.ApplyDirection(coords, grids.West)] {
				nextCell := grids.Coords{X: i - 1, Y: j}
				for plants.plantMap[nextCell] && !plants.plantMap[grids.ApplyDirection(nextCell, grids.West)] {
					i--
					nextCell.X--
				}
				sides++
			}
		}
	}

	return sides
}
