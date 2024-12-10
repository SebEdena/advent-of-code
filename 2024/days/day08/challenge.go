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
	grid, bounds := parseInput(input)

	antinodes := make(map[grids.Coords]bool)

	for _, coords := range grid {
		for i := 0; i < len(coords); i++ {
			for j := 0; j < len(coords); j++ {
				if i == j {
					continue
				}
				xDelta, yDelta := getSymmetricDelta(&(coords)[i], &(coords)[j])

				symCoords := grids.Coords{X: (coords)[j].X + xDelta, Y: (coords)[j].Y + yDelta}

				if grids.ValidCoordinates(symCoords, bounds[0], bounds[1]) {
					antinodes[symCoords] = true
				}

			}
		}
	}

	return len(antinodes)
}

func part2(input *string) int {
	grid, bounds := parseInput(input)

	antinodes := make(map[grids.Coords]bool)

	for _, coords := range grid {
		for i := 0; i < len(coords); i++ {
			for j := 0; j < len(coords); j++ {
				if i == j {
					continue
				}
				xDelta, yDelta := getSymmetricDelta(&(coords)[i], &(coords)[j])

				var symCoords grids.Coords = (coords)[i]
				for {
					symCoords = grids.Coords{X: symCoords.X + xDelta, Y: symCoords.Y + yDelta}
					if !grids.ValidCoordinates(symCoords, bounds[0], bounds[1]) {
						break
					}
					antinodes[symCoords] = true
				}
			}
		}
	}

	return len(antinodes)
}

type AntennaGrid map[string][]grids.Coords

func parseInput(input *string) (AntennaGrid, [2]int) {

	dataMap := make(AntennaGrid)
	var bounds [2]int

	rows := strings.Split(*input, "\n")
	for i, line := range rows {
		cols := strings.Split(line, "")

		for j, char := range cols {
			if i == 0 && j == 0 {
				bounds = [2]int{len(rows), len(cols)}
			}

			strChar := string(char)
			if strChar != "." {
				if dataMap[strChar] == nil {
					dataMap[strChar] = make([]grids.Coords, 0)
				}
				dataMap[strChar] = append(dataMap[strChar], grids.Coords{X: i, Y: j})
			}
		}
	}

	return dataMap, bounds
}

func getSymmetricDelta(coord *grids.Coords, center *grids.Coords) (xDelta int, yDelta int) {
	xDelta = center.X - coord.X
	yDelta = center.Y - coord.Y
	return
}
