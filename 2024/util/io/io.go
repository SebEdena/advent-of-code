package io

import (
	"os"
	"regexp"
	"strconv"
	"strings"
)

func ReadInputFile(path string) *string {
	content, err := os.ReadFile(path)

	if err != nil {
		panic(err)
	}

	input := string(content)

	return &input
}

func ToStringSlice(input *string, columnSplitter string) *[][]string {
	str := regexp.MustCompile(`[ ]+`).ReplaceAllString(strings.TrimSpace(string(*input)), " ")

	data := make([][]string, 0)

	for _, row := range strings.Split(str, "\n") {
		words := strings.Split(strings.TrimSpace(row), columnSplitter)

		data = append(data, words)
	}

	return &data
}

func ToIntSlice(input *string, columnSplitter string) *[][]int {

	str := regexp.MustCompile(`[ ]+`).ReplaceAllString(strings.TrimSpace(string(*input)), " ")

	rows := strings.Split(str, "\n")

	data := make([][]int, len(rows))

	for i, row := range rows {
		words := strings.Split(strings.TrimSpace(row), columnSplitter)

		for j, word := range words {
			num, err := strconv.Atoi(word)
			if err != nil {
				panic(err)
			}
			data[i][j] = num
		}
	}

	return &data
}
