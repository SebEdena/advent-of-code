package main

import (
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
	flag.IntVar(&part, "part", 2, "part 1 or 2")
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
	instructRegex := regexp.MustCompile(`mul|don't|do`)
	mulRegex := regexp.MustCompile(`mul\((\d{1,3}),(\d{1,3})\)`)

	muls := make([][2]int, 0)

	enabled := true

	remainingStr := strings.Clone(*input)

	index := instructRegex.FindStringSubmatchIndex(remainingStr)
	for index != nil {
		switch remainingStr[index[0]:index[1]] {
		case "mul":
			{
				remainingStr = remainingStr[index[0]:]
				mulIndex := mulRegex.FindStringSubmatchIndex(remainingStr)
				if mulIndex != nil && mulIndex[0] == 0 {
					if enabled {
						mul := mulRegex.FindStringSubmatch(remainingStr)
						operandA, _ := strconv.Atoi(mul[1])
						operandB, _ := strconv.Atoi(mul[2])
						muls = append(muls, [2]int{operandA, operandB})
					}
					index = mulIndex
				}
			}
		case "do":
			enabled = true
		case "don't":
			enabled = false
		}
		remainingStr = remainingStr[index[1]:]
		index = instructRegex.FindStringSubmatchIndex(remainingStr)
	}

	return muls
}
