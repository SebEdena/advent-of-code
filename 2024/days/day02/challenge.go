package main

import (
	"aoc-2024/util/io"
	"aoc-2024/util/math"
	"flag"
	"fmt"
	"os"
	"slices"
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
	os.Exit(0)
}

func part1(input *[][]string) int {
	reports := io.ConvertToNumber(input)
	safeReports := 0

	for i, report := range reports {
		if isSafeReport(&report) {
			println(i+1, true)
			safeReports++
		} else {
			println(i+1, false)
		}
	}

	return safeReports
}

func part2(input *[][]string) int {
	reports := io.ConvertToNumber(input)
	safeReports := 0

	for _, report := range reports {
		safe := isSafeReport(&report)
		i := 0
		for !safe && i < len(report) {
			clone := slices.Concat(report[:i], report[i+1:])
			safe = isSafeReport(&clone)
			i++
		}
		if safe {
			safeReports++
		}
	}

	return safeReports
}

func isSafeReport(report *[]int) bool {
	var difference int
	differenceAssigned := false
	for i := 1; i < len(*report); i++ {
		newDifference := (*report)[i] - (*report)[i-1]
		switch math.Abs(newDifference) {
		case 1, 2, 3:
			{
				if differenceAssigned && !math.SameSign(difference, newDifference) {
					return false
				}
			}
		default:
			return false
		}
		difference = newDifference
		differenceAssigned = true
	}
	return true
}
