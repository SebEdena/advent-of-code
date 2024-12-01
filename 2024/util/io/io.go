package io

import (
	"os"
	"regexp"
	"strconv"
	"strings"
)

func ReadInputFile(path string) [][]string {
	content, err := os.ReadFile(path)

	if err != nil {
		panic(err)
	}

	return ParseInputFromBytes(&content)
}

func ParseInputFromBytes(input *[]byte) [][]string {
	str := regexp.MustCompile(`[ ]+`).ReplaceAllString(strings.TrimSpace(string(*input)), " ")

	data := make([][]string, 0)

	for _, row := range strings.Split(str, "\n") {
		words := strings.Split(strings.TrimSpace(row), " ")

		data = append(data, words)
	}

	return data
}

func ConvertToNumber(input *[][]string) [][]int {
	result := make([][]int, len(*input))
	for i, row := range *input {
		numRow := make([]int, len(row))
		for j, numStr := range row {
			numInt, err := strconv.Atoi(numStr)
			if err != nil {
				panic(err)
			}
			numRow[j] = numInt
		}
		result[i] = numRow
	}
	return result
}

func CreateDayFile(day int) {
	os.MkdirAll("days/day"+strconv.Itoa(day), os.ModePerm)
	os.Create("days/day" + strconv.Itoa(day) + "/part1.go")
	os.Create("days/day" + strconv.Itoa(day) + "/part2.go")
	os.Create("days/day" + strconv.Itoa(day) + "/input.txt")
}
