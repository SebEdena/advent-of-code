package day1

import (
	"aoc-2024/util/io"
	"aoc-2024/util/math"
)

func Part1(input *[][]string) int {
	numbers := io.ConvertToNumber(input)

	list1, list2 := extractLists(&numbers)

	return oneToOneDifference(&list1, &list2)
}

func oneToOneDifference(list1 *[]int, list2 *[]int) int {
	difference := 0

	for i, num := range *list1 {
		difference += math.Abs(num - (*list2)[i])
	}

	return difference
}
