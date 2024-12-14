package main

import (
	"aoc-2024/util/io"
	"errors"
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
	data := parseInput(input, 0)

	tokens := 0
	for _, eq := range data {
		solution, err := solve(&eq)

		if err == nil {
			tokens += countTokens(solution)
		}
	}

	return tokens
}

func part2(input *string) int {
	data := parseInput(input, 10000000000000)

	tokens := 0
	for _, eq := range data {
		solution, err := solve(&eq)

		if err == nil {
			tokens += countTokens(solution)
		}
	}

	return tokens
}

type Equation struct {
	a, b, target struct{ x, y int }
}

func parseInput(input *string, addToTarget int) []Equation {
	rows := strings.Split((*input), "\n")

	buttonRx := regexp.MustCompile(`X\+(\d+), Y\+(\d+)`)
	targetRx := regexp.MustCompile(`X=(\d+), Y=(\d+)`)

	equations := make([]Equation, (len(rows)+1)/4)

	for i, row := range rows {

		switch i % 4 {
		case 0, 1:
			re := buttonRx.FindStringSubmatch(row)
			x, _ := strconv.Atoi(re[1])
			y, _ := strconv.Atoi(re[2])

			if i%4 == 0 {
				equations[i/4].a = struct {
					x int
					y int
				}{x, y}
			} else {
				equations[i/4].b = struct {
					x int
					y int
				}{x, y}
			}
		case 2:
			re := targetRx.FindStringSubmatch(row)
			x, _ := strconv.Atoi(re[1])
			y, _ := strconv.Atoi(re[2])
			equations[i/4].target = struct {
				x int
				y int
			}{addToTarget + x, addToTarget + y}
		}

	}

	return equations
}

func solve(equation *Equation) (struct{ x, y int }, error) {

	det := equation.a.x*equation.b.y - equation.a.y*equation.b.x

	if det == 0 {
		return struct{ x, y int }{0, 0}, errors.New("multiple solutions exist")
	} else {
		detX := equation.target.x*equation.b.y - equation.target.y*equation.b.x
		detY := equation.a.x*equation.target.y - equation.a.y*equation.target.x

		x := float64(detX) / float64(det)
		y := float64(detY) / float64(det)

		if x != float64(int(x)) || y != float64(int(y)) {
			return struct{ x, y int }{0, 0}, errors.New("no integer solution exists")
		}

		return struct {
			x int
			y int
		}{int(x), int(y)}, nil
	}
}

func countTokens(solution struct{ x, y int }) int {
	return 3*solution.x + solution.y
}
