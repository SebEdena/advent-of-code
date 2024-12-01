package day1

import (
	"aoc-2024/util/io"
)

func Part2(input *[][]string) int {
	numbers := io.ConvertToNumber(input)

	return similarityScore(&numbers)
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
