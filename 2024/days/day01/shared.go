package day1

import "slices"

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
