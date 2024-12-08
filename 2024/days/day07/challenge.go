package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"slices"
	"strconv"
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
	data := parseInput(input)

	total := 0
	for _, operation := range *data {
		if hasValidOperation(operation.result, operation.operands, []string{"+", "*"}) {
			total += operation.result
		}
	}

	return total
}

func part2(input *string) int {
	data := parseInput(input)

	total := 0
	for _, operation := range *data {
		if hasValidOperation(operation.result, operation.operands, []string{"+", "*", "||"}) {
			total += operation.result
		}
	}

	return total
}

type Operation struct {
	result   int
	operands []int
}

func parseInput(input *string) *[]Operation {
	str := strings.Replace(*input, ":", "", -1)
	data := io.ToIntSlice(&str, " ")

	operations := make([]Operation, len(*data))

	for i, line := range *data {
		operations[i] = Operation{
			result:   line[0],
			operands: line[1:],
		}
	}

	return &operations
}

func hasValidOperation(result int, operands []int, operators []string) bool {
	var isValid bool
	for _, operator := range operators {
		var subOperation int
		switch operator {
		case "+":
			subOperation = operands[0] + operands[1]
		case "*":
			subOperation = operands[0] * operands[1]
		case "||":
			subOperation, _ = strconv.Atoi(fmt.Sprintf("%d%d", operands[0], operands[1]))
		}
		if len(operands) == 2 {
			isValid = subOperation == result
		} else {
			isValid = hasValidOperation(result, slices.Concat([]int{subOperation}, operands[2:]), operators)
		}
		if isValid {
			return true
		}
	}

	return false
}
