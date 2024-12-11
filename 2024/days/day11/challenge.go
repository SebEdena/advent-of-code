package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"strconv"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 2, "part 1 or 2")
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
	data := (*io.ToIntSlice(input, " "))[0]

	return computeBlinks(data, 25)
}

func part2(input *string) int {
	data := (*io.ToIntSlice(input, " "))[0]

	return computeBlinks(data, 75)
}

func computeBlinks(stones []int, blinks int) int {
	stoneMap := make(map[int]int)

	for _, stone := range stones {
		stoneMap[stone]++
	}

	for blink := 0; blink < blinks; blink++ {
		newStones := make(map[int]int)
		for stone, count := range stoneMap {
			stoneResults := processStone(stone)

			for _, newStone := range stoneResults {
				newStones[newStone] += count
			}
		}
		stoneMap = newStones
	}

	totalStones := 0
	for _, count := range stoneMap {
		totalStones += count
	}

	return totalStones
}

func processStone(stone int) []int {
	if stone == 0 {
		return []int{1}
	} else {
		stoneStr := strconv.Itoa(stone)
		if len(stoneStr)%2 == 0 {
			leftStone, _ := strconv.Atoi(stoneStr[:len(stoneStr)/2])
			rightStone, _ := strconv.Atoi(stoneStr[len(stoneStr)/2:])
			return []int{leftStone, rightStone}
		} else {
			return []int{stone * 2024}
		}
	}
}
