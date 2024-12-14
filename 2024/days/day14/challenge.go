package main

import (
	"aoc-2024/util/grids"
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"regexp"
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
	robots := parseInput(input)

	totalSeconds := 100
	bounds := [2]int{101, 103}

	for s := 0; s < totalSeconds; s++ {
		for i := 0; i < len(robots); i++ {
			nextMove(&robots[i], bounds)
		}
	}

	return safetyFactor(&robots, bounds)
}

func part2(input *string) int {
	robots := parseInput(input)

	bounds := [2]int{101, 103}

	bestSafetyFactor := -1
	bestSeconds := 0

	s := 1
	for s <= 10000 {
		for i := 0; i < len(robots); i++ {
			nextMove(&robots[i], bounds)
		}
		factor := safetyFactor(&robots, bounds)

		if bestSafetyFactor < 0 || factor < bestSafetyFactor {
			bestSafetyFactor = factor
			bestSeconds = s
		}
		s++
	}

	return bestSeconds
}

type Robot struct {
	id                 int
	position, velocity grids.Coords
}

func parseInput(input *string) []Robot {
	rows := strings.Split((*input), "\n")

	robotRx := regexp.MustCompile(`^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$`)

	robots := make([]Robot, len(rows))

	for i, row := range rows {
		matches := robotRx.FindStringSubmatch(row)

		x, _ := strconv.Atoi(matches[1])
		y, _ := strconv.Atoi(matches[2])
		vx, _ := strconv.Atoi(matches[3])
		vy, _ := strconv.Atoi(matches[4])

		robots[i].id = i
		robots[i].position = grids.Coords{X: x, Y: y}
		robots[i].velocity = grids.Coords{X: vx, Y: vy}
	}

	return robots
}

// We won't use position = (position + time * velocity) mod [bounds] :
// Because of part 2, where we need the safety factor for each second
func nextMove(robot *Robot, bounds [2]int) {
	newPosition := grids.Coords{
		X: robot.position.X + robot.velocity.X, Y: robot.position.Y + robot.velocity.Y}

	if newPosition.X < 0 {
		offset := newPosition.X
		newPosition.X = bounds[0] + offset
	}

	if newPosition.X >= bounds[0] {
		offset := newPosition.X - bounds[0]
		newPosition.X = offset
	}

	if newPosition.Y < 0 {
		offset := newPosition.Y
		newPosition.Y = bounds[1] + offset
	}

	if newPosition.Y >= bounds[1] {
		offset := newPosition.Y - bounds[1]
		newPosition.Y = offset
	}

	robot.position = newPosition

}

func safetyFactor(robots *[]Robot, bounds [2]int) int {

	middle := [2]int{bounds[0] / 2, bounds[1] / 2}

	quadrantsCount := make(map[int]int)

	for i := 0; i < len(*robots); i++ {
		if (*robots)[i].position.X < middle[0] && (*robots)[i].position.Y < middle[1] {
			quadrantsCount[1]++
			continue
		}

		if (*robots)[i].position.X > middle[0] && (*robots)[i].position.Y < middle[1] {
			quadrantsCount[2]++
			continue
		}

		if (*robots)[i].position.X < middle[0] && (*robots)[i].position.Y > middle[1] {
			quadrantsCount[3]++
			continue
		}

		if (*robots)[i].position.X > middle[0] && (*robots)[i].position.Y > middle[1] {
			quadrantsCount[4]++
			continue
		}
	}

	factor := 1
	for _, v := range quadrantsCount {
		factor *= v
	}

	return factor
}
