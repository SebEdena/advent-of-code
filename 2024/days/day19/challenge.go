package main

import (
	"aoc-2024/util/io"
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
	patterns, testDesigns := parseInput(input)

	cache := make(map[string]int)

	designs := 0
	for _, design := range testDesigns {
		if validDesigns(design, &patterns, &cache) > 0 {
			designs++
		}
	}

	return designs
}

func part2(input *string) int {
	patterns, testDesigns := parseInput(input)

	cache := make(map[string]int)

	designs := 0
	for _, design := range testDesigns {
		designs += validDesigns(design, &patterns, &cache)
	}

	return designs
}

func parseInput(input *string) ([]string, []string) {
	data := strings.Split(*input, "\n")

	patterns := strings.Split(data[0], ", ")

	slices.SortFunc(patterns, func(a, b string) int {
		return len(a) - len(b)
	})

	testDesigns := data[2:]

	return patterns, testDesigns
}

func validDesigns(design string, patterns *[]string, cache *map[string]int) int {

	if value, inCache := (*cache)[design]; inCache {
		return value
	}

	designs := 0

	for _, pattern := range *patterns {
		if len(design) == len(pattern) {
			if design == pattern {
				designs++
			}
		} else {
			if strings.HasPrefix(design, pattern) {
				subDesign := design[len(pattern):]
				designs += validDesigns(subDesign, patterns, cache)
			}
		}
	}

	(*cache)[design] = designs
	return designs

}
