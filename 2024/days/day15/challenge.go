package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"flag"
	"fmt"
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

	grid, moves, robotCoords := parseInput(input)

	for _, move := range moves {
		switch string(move) {
		case "^":
			robotCoords = moveRobot(&grid, robotCoords, grids.North)
		case ">":
			robotCoords = moveRobot(&grid, robotCoords, grids.East)
		case "v":
			robotCoords = moveRobot(&grid, robotCoords, grids.South)
		case "<":
			robotCoords = moveRobot(&grid, robotCoords, grids.West)
		}
	}

	score := countBoxes(&grid)

	return score
}

func part2(input *string) int {
	warehouse, moves := parseInput2(input)

	for _, move := range moves {
		switch string(move) {
		case "^":
			moveRobotWide(&warehouse, grids.North)
		case ">":
			moveRobotWide(&warehouse, grids.East)
		case "v":
			moveRobotWide(&warehouse, grids.South)
		case "<":
			moveRobotWide(&warehouse, grids.West)
		}
	}

	return countBoxes2(&warehouse)
}

type Warehouse struct {
	walls, boxes map[grids.Coords]bool
	robotCoords  grids.Coords
	bounds       [2]int
}

func parseInput(input *string) (grids.Grid[string], string, grids.Coords) {
	parts := strings.Split(*input, "\n\n")

	grid := grids.ParseGrid(io.ToStringSlice(&parts[0], ""))

	moves := strings.ReplaceAll(parts[1], "\n", "")

	for i := 0; i < grid.Rows; i++ {
		for j := 0; j < grid.Cols; j++ {
			coords := grids.Coords{X: i, Y: j}
			if grid.GetElement(coords) == "@" {
				return grid, moves, coords
			}
		}
	}

	panic("No starting point found")
}

func parseInput2(input *string) (Warehouse, string) {

	parts := strings.Split(*input, "\n\n")

	walls := make(map[grids.Coords]bool)
	boxes := make(map[grids.Coords]bool)
	robotCoords := grids.Coords{}
	bounds := [2]int{0, 0}

	moves := strings.ReplaceAll(parts[1], "\n", "")

	rows := strings.Split(parts[0], "\n")

	for i, row := range rows {
		for j, char := range row {
			if i == 0 || j == 0 {
				bounds = [2]int{len(rows), len(row) * 2}
			}
			switch string(char) {
			case "#":
				walls[grids.Coords{X: i, Y: j * 2}] = true
				walls[grids.Coords{X: i, Y: j*2 + 1}] = true
			case "O":
				boxes[grids.Coords{X: i, Y: j * 2}] = true
			case "@":
				robotCoords = grids.Coords{X: i, Y: j * 2}
			}
		}
	}

	warehouse := Warehouse{walls: walls, boxes: boxes,
		robotCoords: robotCoords, bounds: bounds}

	return warehouse, moves
}

func moveRobot(grid *grids.Grid[string], coords grids.Coords, direction grids.Direction) grids.Coords {
	nextRobotCoords := grids.ApplyDirection(coords, direction)
	nextCoords := nextRobotCoords
	boxes := make([]grids.Coords, 0)

	for grid.GetElement(nextCoords) != "#" {
		if grid.GetElement(nextCoords) == "O" {
			boxes = append(boxes, nextCoords)
		} else {
			for _, boxCoords := range boxes {
				grid.SetElement(grids.ApplyDirection(boxCoords, direction), "O")
			}
			grid.SetElement(nextRobotCoords, "@")
			grid.SetElement(coords, ".")
			return nextRobotCoords
		}
		nextCoords = grids.ApplyDirection(nextCoords, direction)
	}

	return coords
}

func moveRobotWide(warehouse *Warehouse, direction grids.Direction) {
	nextCoords := grids.ApplyDirection(warehouse.robotCoords, direction)

	if !grids.ValidCoordinates(nextCoords, warehouse.bounds[0], warehouse.bounds[1]) || warehouse.walls[nextCoords] {
		return
	}

	boxes := make([]grids.Coords, 0)

	switch direction {
	case grids.North, grids.South:
		if warehouse.boxes[nextCoords] {
			boxes = freeBoxes(warehouse, nextCoords, direction)
		} else if warehouse.boxes[grids.Coords{X: nextCoords.X, Y: nextCoords.Y - 1}] {
			boxes = freeBoxes(warehouse, grids.Coords{X: nextCoords.X, Y: nextCoords.Y - 1}, direction)
		}
	case grids.West:
		if warehouse.boxes[grids.Coords{X: nextCoords.X, Y: nextCoords.Y - 1}] {
			boxes = freeBoxes(warehouse, grids.Coords{X: nextCoords.X, Y: nextCoords.Y - 1}, direction)
		}
	case grids.East:
		if warehouse.boxes[nextCoords] {
			boxes = freeBoxes(warehouse, nextCoords, direction)
		}
	}

	if boxes == nil {
		return
	}

	if len(boxes) > 0 {
		for i := len(boxes) - 1; i >= 0; i-- {
			warehouse.boxes[grids.ApplyDirection(boxes[i], direction)] = true
			warehouse.boxes[boxes[i]] = false
		}
	}

	warehouse.robotCoords = nextCoords
}

func countBoxes(grid *grids.Grid[string]) int {
	score := 0
	for i := 0; i < grid.Rows; i++ {
		for j := 0; j < grid.Cols; j++ {
			if grid.GetElement(grids.Coords{X: i, Y: j}) == "O" {
				score += 100*i + j
			}
		}
	}

	return score
}

func countBoxes2(warehouse *Warehouse) int {
	score := 0
	for i := 0; i < warehouse.bounds[0]; i++ {
		for j := 0; j < warehouse.bounds[1]; j++ {
			if warehouse.boxes[grids.Coords{X: i, Y: j}] {
				score += 100*i + j
			}
		}
	}

	return score
}

func freeBoxes(warehouse *Warehouse, firstBox grids.Coords, direction grids.Direction) []grids.Coords {
	boxes := make([]grids.Coords, 0)

	if direction == grids.North || direction == grids.South {
		coordsToCheck := []grids.Coords{firstBox}
		boxes = append(boxes, firstBox)
		visitedCoords := make(map[grids.Coords]bool)
		for len(coordsToCheck) > 0 {
			coords := coordsToCheck[0]
			coordsToCheck = coordsToCheck[1:]

			if visitedCoords[coords] {
				continue
			}

			if warehouse.walls[coords] {
				return nil
			}

			if !visitedCoords[coords] {
				next1 := grids.ApplyDirection(coords, direction)
				nextMin1 := grids.Coords{X: next1.X, Y: next1.Y - 1}
				nextPlus1 := grids.Coords{X: next1.X, Y: next1.Y + 1}

				for _, nextCoords := range []grids.Coords{next1, nextPlus1} {
					if warehouse.walls[nextCoords] {
						return nil
					}
				}

				for _, nextCoords := range []grids.Coords{nextMin1, next1, nextPlus1} {
					if warehouse.boxes[nextCoords] {
						boxes = append(boxes, nextCoords)
						coordsToCheck = append(coordsToCheck, nextCoords)
					}
				}
				visitedCoords[coords] = true
			}
		}

		return boxes
	} else {
		if direction == grids.West {
			nextCoords := firstBox
			for grids.ValidCoordinates(nextCoords, warehouse.bounds[0], warehouse.bounds[1]) {
				if !warehouse.boxes[nextCoords] {
					if warehouse.walls[grids.Coords{X: nextCoords.X, Y: nextCoords.Y + 1}] {
						return nil
					} else {
						return boxes
					}
				}
				boxes = append(boxes, nextCoords)
				nextCoords = grids.Coords{X: nextCoords.X, Y: nextCoords.Y - 2}
			}
			return nil
		} else {
			nextCoords := firstBox
			for !warehouse.walls[nextCoords] {
				if !warehouse.boxes[nextCoords] {
					if warehouse.walls[grids.Coords{X: nextCoords.X, Y: nextCoords.Y - 1}] {
						return nil
					} else {
						return boxes
					}
				}
				boxes = append(boxes, nextCoords)
				nextCoords = grids.Coords{X: nextCoords.X, Y: nextCoords.Y + 2}
			}
			return nil
		}
	}
}
