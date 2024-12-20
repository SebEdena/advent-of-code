package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"math"
	"regexp"
	"slices"
	"strconv"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 1, "part 1 or 2")
	flag.Parse()

	var result string
	if part == 1 {
		result = part1(input)
	} else if part == 2 {
		result = strconv.Itoa(part2(input))
	} else {
		panic("Invalid part")
	}

	fmt.Println(result)
}

func part1(input *string) string {
	state, program := parseInput(input)

	output := runCommand(&program, &state)

	outputString := ""
	for i, val := range output {
		outputString += fmt.Sprintf("%d", val)
		if i < len(output)-1 {
			outputString += ","
		}
	}

	return outputString
}

func part2(input *string) int {
	_, program := parseInput(input)
	output := make([]int, 0)
	match := []int{program[len(program)-1]}

	aTest := int(math.Pow(8, float64(len(program)-1)))
	power := len(program) - 2

	for !slices.Equal(output, program) {
		aTest += int(math.Pow(8, float64(power)))
		output = runCommand(&program, &State{aTest, 0, 0})

		if slices.Equal(output[len(output)-len(match):], match) {
			power = int(math.Max(0, float64(power-1)))
			firstIndex := int(math.Max(float64(len(output)-(len(match)+1)), 0))
			match = program[firstIndex:]
		}
	}

	return aTest
}

type State struct {
	A, B, C int
}

func parseInput(input *string) (State, []int) {
	rx := regexp.MustCompile(`(\d+)`)

	data := rx.FindAllStringSubmatch(*input, -1)

	var A, B, C int
	program := make([]int, 0)
	A, _ = strconv.Atoi(data[0][0])
	B, _ = strconv.Atoi(data[1][0])
	C, _ = strconv.Atoi(data[2][0])

	for i := 3; i < len(data); i++ {
		val, _ := strconv.Atoi(data[i][0])
		program = append(program, val)
	}

	return State{A, B, C}, program
}

func runCommand(program *[]int, state *State) []int {
	pointer := 0

	output := make([]int, 0)

	for pointer < len(*program) {
		result := execute(&pointer, program, state)
		if result != nil {
			output = append(output, *result)
		}
	}

	return output
}

func execute(pointer *int, program *[]int, state *State) *int {
	opcode := (*program)[*pointer]

	switch opcode {
	case 0:
		numerator := float64(state.A)
		denominator := math.Pow(2, float64(getCombo((*program)[*pointer+1], state)))
		value := int(numerator / denominator)
		state.A = value
		*pointer += 2
		return nil
	case 1:
		value := state.B ^ (*program)[*pointer+1]
		state.B = value
		*pointer += 2
		return nil
	case 2:
		value := getCombo((*program)[*pointer+1], state) % 8
		state.B = value
		*pointer += 2
		return nil
	case 3:
		if state.A == 0 {
			*pointer += 2
		} else {
			*pointer = (*program)[*pointer+1]
		}
		return nil
	case 4:
		value := state.B ^ state.C
		state.B = value
		*pointer += 2
		return nil
	case 5:
		value := getCombo((*program)[*pointer+1], state) % 8
		*pointer += 2
		return &value
	case 6:
		numerator := float64(state.A)
		denominator := math.Pow(2, float64(getCombo((*program)[*pointer+1], state)))
		value := int(numerator / denominator)
		state.B = value
		*pointer += 2
		return nil
	case 7:
		numerator := float64(state.A)
		denominator := math.Pow(2, float64(getCombo((*program)[*pointer+1], state)))
		value := int(numerator / denominator)
		state.C = value
		*pointer += 2
		return nil
	}

	return nil
}

func getCombo(operand int, state *State) int {

	switch operand {
	case 0, 1, 2, 3:
		return operand
	case 4:
		return state.A
	case 5:
		return state.B
	case 6:
		return state.C
	default:
		return 0
	}

}
