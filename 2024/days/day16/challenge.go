package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"aoc-2024/util/math"
	"flag"
	"fmt"
	"slices"
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
	maze := parseInput(input)

	paths := findShortestPath(maze, PathStep{coords: maze.start, direction: grids.East})

	if len(paths) == 0 {
		panic("No path found")
	}

	return paths[0][len(paths[0])-1].g
}

func part2(input *string) int {
	maze := parseInput(input)

	paths := findShortestPath(maze, PathStep{coords: maze.start, direction: grids.East})

	if len(paths) == 0 {
		panic("No path found")
	}

	shortestPathsTiles := make(map[grids.Coords]bool)

	for _, path := range paths {
		for _, step := range path {
			shortestPathsTiles[step.element.coords] = true
		}
	}

	return len(shortestPathsTiles)
}

type Maze struct {
	start, end grids.Coords
	walls      map[grids.Coords]bool
	bounds     [2]int
}

func parseInput(input *string) Maze {

	rows := strings.Split((*input), "\n")

	var start, end grids.Coords
	var bounds [2]int

	walls := make(map[grids.Coords]bool)

	for i, row := range rows {
		for j, char := range row {
			if i == 0 && j == 0 {
				bounds = [2]int{len(rows), len(row)}
			}
			switch string(char) {
			case "S":
				start = grids.Coords{X: i, Y: j}
			case "E":
				end = grids.Coords{X: i, Y: j}
			case "#":
				walls[grids.Coords{X: i, Y: j}] = true
			}
		}

	}

	return Maze{start, end, walls, bounds}
}

type PathStep struct {
	coords    grids.Coords
	direction grids.Direction
}

type Heuristic struct {
	element *PathStep
	f, g, h int
	parent  *Heuristic
}

func findShortestPath(maze Maze, start PathStep) [][]Heuristic {
	openedList := make([]Heuristic, 0)
	openedList = append(openedList, Heuristic{element: &start, f: 0, g: 0, h: 0, parent: nil})

	fScoreMap := make(map[PathStep]int)

	paths := make([][]Heuristic, 0)

	for len(openedList) > 0 {
		current := openedList[0]
		openedList = openedList[1:]

		anticlockwise := PathStep{coords: current.element.coords, direction: grids.Rotate(current.element.direction, -90)}
		forward := PathStep{coords: grids.ApplyDirection(current.element.coords, current.element.direction), direction: current.element.direction}
		clockwise := PathStep{coords: current.element.coords, direction: grids.Rotate(current.element.direction, 90)}

		for _, successor := range []PathStep{anticlockwise, forward, clockwise} {
			if maze.walls[successor.coords] {
				continue
			}

			var f, g, h int
			if successor.direction == current.element.direction {
				g = current.g + 1
			} else {
				g = current.g + 1000
			}
			h = math.ManhattanDistance(successor.coords, maze.end)
			f = g + h
			successorHeuristic := Heuristic{element: &successor, f: f, g: g, h: h, parent: &current}

			if successor.coords == maze.end {
				if len(paths) > 0 && successorHeuristic.g > paths[0][len(paths[0])-1].g {
					continue
				}

				path := make([]Heuristic, 0)
				path = append(path, successorHeuristic)
				step := &successorHeuristic
				for step != nil {
					path = slices.Insert(path, 0, *step)
					step = step.parent
				}

				paths = append(paths, path)
			}

			if fScoreMap[successor] != 0 && f > fScoreMap[successor] {
				continue
			}

			insertIndex := slices.IndexFunc(openedList, func(he Heuristic) bool {
				return he.f >= successorHeuristic.f
			})
			if insertIndex == -1 {
				insertIndex = len(openedList)
			}
			openedList = slices.Insert(openedList, insertIndex, successorHeuristic)
			if fScoreMap[successor] == 0 || f < fScoreMap[successor] {
				fScoreMap[successor] = f
			}
		}
	}

	return paths
}
