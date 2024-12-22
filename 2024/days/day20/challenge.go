package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"aoc-2024/util/math"
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
	start, end, walls := parseInput(input)

	path := processTrack(start, end, walls)

	cheats := findCheats(path, 2, 100)

	return len(cheats)
}

func part2(input *string) int {
	start, end, walls := parseInput(input)

	path := processTrack(start, end, walls)

	cheats := findCheats(path, 20, 100)

	return len(cheats)
}

func parseInput(input *string) (grids.Coords, grids.Coords, map[grids.Coords]bool) {

	var start, end grids.Coords
	walls := make(map[grids.Coords]bool)

	rows := strings.Split(*input, "\n")
	for i, cols := range rows {
		for j, char := range cols {
			switch string(char) {
			case "#":
				walls[grids.Coords{X: i, Y: j}] = true
			case "S":
				start = grids.Coords{X: i, Y: j}
			case "E":
				end = grids.Coords{X: i, Y: j}
			}
		}
	}

	return start, end, walls
}

type Step struct {
	coords grids.Coords
	steps  int
}

type Cheat struct {
	start grids.Coords
	end   grids.Coords
	gain  int
}

func processTrack(start, end grids.Coords, walls map[grids.Coords]bool) []grids.Coords {
	directions := []grids.Direction{grids.North, grids.East, grids.South, grids.West}
	toVisit := []Step{{coords: start, steps: 0}}
	visited := make(map[grids.Coords]bool)

	path := make([]grids.Coords, 0)

	for len(toVisit) > 0 {
		step := toVisit[0]
		toVisit = toVisit[1:]

		path = append(path, step.coords)
		visited[step.coords] = true

		if step.coords == end {
			break
		}

		for _, dir := range directions {
			newCoords := grids.ApplyDirection(step.coords, dir)
			if !walls[newCoords] && !visited[newCoords] {
				toVisit = append(toVisit, Step{coords: newCoords, steps: step.steps + 1})
			}
		}
	}

	return path
}

func findCheats(path []grids.Coords, maxLength, minGain int) []Cheat {

	cheats := make([]Cheat, 0)

	for i, start := range path[:len(path)-minGain] {
		for j, end := range path[i+minGain:] {
			distance := math.ManhattanDistance(start, end)
			timeSaved := minGain + j - distance

			if distance <= maxLength && timeSaved >= minGain {
				cheats = append(cheats, Cheat{start: start, end: end, gain: timeSaved})
			}
		}
	}

	return cheats
}
