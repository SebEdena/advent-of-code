package main

import (
	"aoc-2024/util/io"
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
	locks, keys := parseInput(input)

	validPairs := 0

	for _, lock := range locks {
	keyLoop:
		for _, key := range keys {
			for i := 0; i < len(lock); i++ {
				if key[i]+lock[i] > 5 {
					continue keyLoop
				}
			}
			validPairs++
		}
	}

	return validPairs
}

func part2(input *string) int {
	return 0
}

func parseInput(input *string) ([][]int, [][]int) {
	lockParts := strings.Split(*input, "\n\n")

	locks := make([][]int, 0)
	keys := make([][]int, 0)

	for _, part := range lockParts {
		lines := strings.Split(part, "\n")
		isLock := !strings.Contains(lines[0], ".")

		if isLock {
			lock := make([]int, len(lines[0]))

			for i := 1; i < len(lines); i++ {
				lockEnd := true
				for j := 0; j < len(lines[0]); j++ {
					if lines[i][j] == '#' {
						lockEnd = false
						lock[j]++
					}
				}
				if lockEnd {
					break
				}
			}

			locks = append(locks, lock)
		} else {
			key := make([]int, len(lines[0]))

			for i := len(lines) - 2; i >= 0; i-- {
				keyEnd := true
				for j := 0; j < len(lines[0]); j++ {
					if lines[i][j] == '#' {
						keyEnd = false
						key[j]++
					}
				}
				if keyEnd {
					break
				}
			}

			keys = append(keys, key)
		}
	}

	return locks, keys
}
