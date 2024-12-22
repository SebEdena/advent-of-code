package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
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
	data := parseInput(input)

	sum := 0
	for _, num := range data {
		for i := 0; i < 2000; i++ {
			num = computeNumber(num)
		}
		fmt.Println(num)
		sum += num
	}

	return sum
}

func part2(input *string) int {
	data := parseInput(input)

	patternLength := 4
	patterns := make(map[string]int)

	window := make([]string, 0)
	for _, num := range data {
		secret := num
		var previous int
		checkedPatterns := make(map[string]bool)
		for i := 0; i < 2000; i++ {
			previous = secret
			secret = computeNumber(secret)
			previousPrice := previous % 10
			price := secret % 10
			window = append(window, strconv.Itoa(price-previousPrice))
			if len(window) == patternLength {
				key := strings.Join(window, ",")
				if !checkedPatterns[key] {
					patterns[key] += price
					checkedPatterns[key] = true
				}
				window = window[1:]
			}
		}
	}

	bestSell := -1
	for _, sell := range patterns {
		if sell > bestSell {
			bestSell = sell
		}
	}

	return bestSell
}

func parseInput(input *string) []int {

	numbers := make([]int, 0)

	for _, line := range strings.Split(*input, "\n") {
		num, _ := strconv.Atoi(line)
		numbers = append(numbers, num)
	}

	return numbers
}

func computeNumber(number int) int {
	result := number
	result = ((result * 64) ^ result) % 16777216
	result = ((result / 32) ^ result) % 16777216
	result = ((result * 2048) ^ result) % 16777216
	return result
}
