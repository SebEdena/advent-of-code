package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"regexp"
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
	start, _, bounds, obstacleMap := parseInput(input)

	_, visitedMap, loop := continueUntilOutOrLoop(start, bounds, &obstacleMap)

	if loop {
		panic("Loop detected")
	}

	return len(visitedMap)
}

func part2(input *string) int {
	start, _, bounds, obstacleMap := parseInput(input)

	path, _, loop := continueUntilOutOrLoop(start, bounds, &obstacleMap)

	if loop {
		panic("Loop detected")
	}

	blockages := make(map[grids.Coords]bool)

	for _, step := range path {
		if step == start {
			continue
		}
		test := testBlocker(
			start, step, bounds, &obstacleMap)
		if test {
			blockages[grids.Coords{X: step.x, Y: step.y}] = true
		}
	}

	return len(blockages)
}

type Step struct {
	x, y      int
	direction grids.Direction
}

type StepMap = map[Step]bool
type ObstacleMap = map[grids.Coords]bool

func parseInput(input *string) (Step, []Step, [2]int, ObstacleMap) {
	str := regexp.MustCompile(`[ ]+`).ReplaceAllString(strings.TrimSpace(string(*input)), " ")

	path := make([]Step, 0)
	obstacleMap := make(ObstacleMap)
	var start *Step

	var bounds [2]int
	rows := strings.Split(str, "\n")
	for i, row := range rows {
		cols := strings.TrimSpace(row)
		for j, char := range cols {
			if i == 0 && j == 0 {
				bounds = [2]int{len(rows), len(cols)}
			}
			switch string(char) {
			case "#":
				obstacleMap[grids.Coords{X: i, Y: j}] = true
			case "^":
				start = &Step{i, j, grids.North}
			}
		}
	}

	if start == nil {
		panic("No start point found!")
	}

	return *start, path, bounds, obstacleMap
}

func forward(step Step, bounds [2]int, obstacles *ObstacleMap) *Step {
	direction := step.direction
	nextCoords := grids.ApplyDirection(
		grids.Coords{X: step.x, Y: step.y}, step.direction,
	)

	if !grids.ValidCoordinates(nextCoords, bounds[0], bounds[1]) {
		return nil
	}

	for (*obstacles)[nextCoords] {

		direction = grids.Rotate(direction, 90)

		nextCoords = grids.ApplyDirection(
			grids.Coords{X: step.x, Y: step.y}, direction,
		)
	}

	return &Step{nextCoords.X, nextCoords.Y, direction}
}

func continueUntilOutOrLoop(
	start Step, bounds [2]int, obstacleMap *ObstacleMap) (
	[]Step, ObstacleMap, bool) {

	visitedStepMap := make(StepMap)
	visitedCoordMap := make(ObstacleMap)
	path := make([]Step, 0)

	var currentStep *Step = &start
	for currentStep != nil {

		if visitedStepMap[*currentStep] {
			return path, visitedCoordMap, true
		}

		path = append(path, *currentStep)
		visitedStepMap[*currentStep] = true
		visitedCoordMap[grids.Coords{X: currentStep.x, Y: currentStep.y}] = true

		currentStep = forward(*currentStep, bounds, obstacleMap)
	}

	return path, visitedCoordMap, false
}

func testBlocker(start, step Step, bounds [2]int, obstacleMap *ObstacleMap) bool {

	obstacleMapCopy := ObstacleMap{{X: step.x, Y: step.y}: true}
	for k, v := range *obstacleMap {
		obstacleMapCopy[k] = v
	}

	stepMapCopy := StepMap{}

	currentStep := start
	for {
		if stepMapCopy[currentStep] {
			return true
		}

		stepMapCopy[currentStep] = true
		stepCoords := grids.Coords{X: currentStep.x, Y: currentStep.y}

		nextCoords := grids.ApplyDirection(stepCoords, currentStep.direction)

		if !grids.ValidCoordinates(nextCoords, bounds[0], bounds[1]) {
			return false
		}

		if obstacleMapCopy[nextCoords] {
			currentStep = Step{currentStep.x, currentStep.y, grids.Rotate(currentStep.direction, 90)}
		} else {
			currentStep = Step{nextCoords.X, nextCoords.Y, currentStep.direction}
		}
	}

}
