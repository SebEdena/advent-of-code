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
	os.Exit(0)
}

func part1(input *[][]string) int {
	numbers := io.ConvertToNumber(input)

	list1, list2 := extractLists(&numbers)

	return oneToOneDifference(&list1, &list2)
}

func part2(input *[][]string) int {
	numbers := io.ConvertToNumber(input)

	return similarityScore(&numbers)
}

func extractLists(list *[][]int) ([]int, []int) {
	list1 := make([]int, 0)
	list2 := make([]int, 0)

	for _, row := range *list {
		list1 = append(list1, row[0])
		list2 = append(list2, row[1])
	}

	slices.Sort(list1)
	slices.Sort(list2)

	return list1, list2
}

func oneToOneDifference(list1 *[]int, list2 *[]int) int {
	difference := 0

	for i, num := range *list1 {
		difference += math.Abs(num - (*list2)[i])
	}

	return difference
}

func mapOccurences(list *[]int) map[int]int {
	occurences := make(map[int]int)
	for _, num := range *list {
		occurences[num]++
	}
	return occurences
}

func similarityScore(numbers *[][]int) int {
	list1, list2 := extractLists(numbers)

	occurenceMap := mapOccurences(&list2)

	score := 0

	for _, num := range list1 {
		score += occurenceMap[num] * num
	}

	return score
}
