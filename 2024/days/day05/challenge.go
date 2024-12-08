package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"slices"
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

	result := 0

	for _, update := range data.updates {
		if !isValidUpdate(&update, &data.rules) {
			result += update[len(update)/2]
		}
	}

	return result
}

func part2(input *string) int {
	data := parseInput(input)

	result := 0

	for _, update := range data.updates {
		if !isValidUpdate(&update, &data.rules) {
			reorderUpdate(&update, &data.rules)
			result += update[len(update)/2]
		}
	}

	return result
}

type Challenge struct {
	rules   map[int][]int
	updates [][]int
}

func parseInput(input *string) *Challenge {

	parts := strings.Split(*input, "\n\n")

	if len(parts) != 2 {
		panic("Invalid input")
	}

	rules := map[int][]int{}
	for _, part := range strings.Split(parts[0], "\n") {
		data := strings.Split(part, "|")
		if len(data) != 2 {
			panic("Invalid input")
		}

		predecessor, err := strconv.Atoi(data[0])
		if err != nil {
			panic("Invalid input")
		}
		successor, err := strconv.Atoi(data[1])
		if err != nil {
			panic("Invalid input")
		}

		if rules[successor] == nil {
			rules[successor] = []int{predecessor}
		} else {
			rules[successor] = append(rules[successor], predecessor)
		}
	}

	updates := *io.ToIntSlice(&parts[1], ",")

	return &Challenge{rules, updates}
}

func isValidUpdate(update *[]int, rules *map[int][]int) bool {
	if len(*update) == 1 {
		return true
	}

	for i := 0; i < len(*update)-1; i++ {
		rule := (*rules)[(*update)[i]]

		for _, r := range rule {
			if slices.Contains((*update)[i+1:], r) {
				return false
			}
		}
	}

	return true
}

func reorderUpdate(update *[]int, rules *map[int][]int) {

	pageCmp := func(a, b int) int {
		if (*rules)[a] != nil && slices.Contains((*rules)[a], b) {
			return 1
		} else if (*rules)[b] != nil && slices.Contains((*rules)[b], a) {
			return -1
		} else {
			return 0
		}
	}

	slices.SortFunc(*update, pageCmp)
}
