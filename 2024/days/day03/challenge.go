package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"regexp"
	"strconv"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 1, "part 1 or 2")
	flag.Parse()
	fmt.Println("Running part", part)

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
	muls := extractMuls(input)
	mulScore := 0

	for _, mul := range muls {
		mulScore += mul[0] * mul[1]
	}

	return mulScore
}

func part2(input *string) int {
	muls := extractMulsExtended(input)
	mulScore := 0

	for _, mul := range muls {
		mulScore += mul[0] * mul[1]
	}

	return mulScore
}

func extractMuls(input *string) [][2]int {
	mulRegex := regexp.MustCompile(`mul\((\d{1,3}),(\d{1,3})\)`)
	muls := make([][2]int, 0)

	result := mulRegex.FindAllStringSubmatch(*input, -1)

	for _, mul := range result {
		operandA, _ := strconv.Atoi(mul[1])
		operandB, _ := strconv.Atoi(mul[2])
		muls = append(muls, [2]int{operandA, operandB})
	}

	return muls
}

func extractMulsExtended(input *string) [][2]int {
	instructRegex := regexp.MustCompile(`mul\(\d{1,3},\d{1,3}\)|do\(\)|don\'t\(\)`)
	mulRegex := regexp.MustCompile(`mul\((\d{1,3}),(\d{1,3})\)`)

	muls := make([][2]int, 0)

	enabled := true

	matches := instructRegex.FindAllString(*input, -1)

	for _, match := range matches {
		switch match {
		case "do()":
			enabled = true
		case "don't()":
			enabled = false
		default:
			if enabled {
				mul := mulRegex.FindStringSubmatch(match)
				operandA, _ := strconv.Atoi(mul[1])
				operandB, _ := strconv.Atoi(mul[2])
				muls = append(muls, [2]int{operandA, operandB})
			}
		}
	}

	return muls
}
