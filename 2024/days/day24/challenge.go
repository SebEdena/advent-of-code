package main

import (
	"aoc-2024/util/io"
	"flag"
	"fmt"
	"math"
	"regexp"
	"slices"
	"strconv"
	"strings"
)

func main() {
	input := io.ReadInputFile("./input.txt")

	var part int
	flag.IntVar(&part, "part", 2, "part 1 or 2")
	flag.Parse()

	var result string
	if part == 1 {
		result = strconv.Itoa(part1(input))
	} else if part == 2 {
		result = part2(input)
	} else {
		panic("Invalid part")
	}

	fmt.Println(result)
}

func part1(input *string) int {
	state, gates := parseInput(input)

	runGates(state, gates)

	result := getOutputWiresResult(state)

	number, _ := strconv.ParseInt(result, 2, 0)

	return int(number)
}

func part2(input *string) string {
	state, gates := parseInput(input)

	x, y := 0, 0
	for register, up := range state {
		if !up {
			continue
		}
		var power int
		if register[0] == 'x' {
			fmt.Sscanf(register, "x%02d", &power)
			x += int(math.Pow(2, float64(power)))
		} else if register[0] == 'y' {
			fmt.Sscanf(register, "y%02d", &power)
			y += int(math.Pow(2, float64(power)))
		}
	}
	output := x + y

	badEndGates := make([]Gate, 0)
	badIntermediateGates := make([]Gate, 0)

	badOutputs := make([]string, 0)

	for _, gate := range gates {
		if gate.out[0] == 'z' && gate.out != "z45" {
			if gate.operator != XOR {
				badEndGates = append(badEndGates, gate)
				badOutputs = append(badOutputs, gate.out)
			}
		} else if !slices.Contains([]string{"x", "y"}, string(gate.a[0])) ||
			!slices.Contains([]string{"x", "y"}, string(gate.b[0])) {
			if gate.operator == XOR {
				badIntermediateGates = append(badIntermediateGates, gate)
				badOutputs = append(badOutputs, gate.out)
			}
		}
	}

	for _, gate := range badIntermediateGates {
		endWire := findEndGate(gate.out, gates)

		for _, g := range badEndGates {
			if g.out == *endWire {
				g.out = gate.out
				gate.out = *endWire
				break
			}
		}
	}

	runGates(state, gates)

	result := getOutputWiresResult(state)
	badAnswer, _ := strconv.ParseInt(result, 2, 0)
	xor := strconv.FormatInt(badAnswer^int64(output), 2)

	falseCarryIndex := 0
	for i := len(xor) - 1; i >= 0; i-- {
		if xor[i] == '1' {
			falseCarryIndex = i
			break
		}
	}

	var firstBadCarryGate *Gate
	for _, gate := range gates {
		if gate.a == fmt.Sprintf("x%02d", falseCarryIndex) || gate.a == fmt.Sprintf("y%02d", falseCarryIndex) {
			if firstBadCarryGate != nil {
				badOutputs = append(badOutputs, firstBadCarryGate.out)
				badOutputs = append(badOutputs, gate.out)
				outWire := firstBadCarryGate.out
				firstBadCarryGate.out = gate.out
				gate.out = outWire
				break
			} else {
				firstBadCarryGate = &gate
			}
		}
	}

	slices.Sort(badOutputs)

	return strings.Join(badOutputs, ",")
}

type Gate struct {
	a, b, out string
	operator  Operator
}

type Operator string

const (
	AND Operator = "AND"
	OR  Operator = "OR"
	XOR Operator = "XOR"
)

func parseInput(input *string) (map[string]bool, []Gate) {

	rows := strings.Split(*input, "\n")

	split := slices.Index(rows, "")

	state := make(map[string]bool)

	wireRx := regexp.MustCompile(`([\w]+): (\d+)`)

	for _, row := range rows[:split] {
		matches := wireRx.FindStringSubmatch(row)
		wire := matches[1]
		value, _ := strconv.ParseBool(matches[2])
		state[wire] = value
	}

	gateRx := regexp.MustCompile(`([\w]+) (AND|OR|XOR) ([\w]+) -> ([\w]+)`)

	gates := make([]Gate, 0)

	for _, row := range rows[split+1:] {
		matches := gateRx.FindStringSubmatch(row)
		a, b, out := matches[1], matches[3], matches[4]
		operator := Operator(matches[2])
		gates = append(gates, Gate{a, b, out, operator})
	}

	return state, gates
}

func runGates(state map[string]bool, gates []Gate) {
	visited := make(map[Gate]bool)

	for len(visited) < len(gates) {
		nextGates := make([]Gate, 0)
		for _, gate := range gates {
			if !visited[gate] && !slices.ContainsFunc(gates, func(g Gate) bool {
				return (gate.a == g.out || gate.b == g.out) && !visited[g]
			}) {
				nextGates = append(nextGates, gate)
			}
		}
		for _, gate := range nextGates {
			switch gate.operator {
			case AND:
				state[gate.out] = state[gate.a] && state[gate.b]
			case OR:
				state[gate.out] = state[gate.a] || state[gate.b]
			case XOR:
				state[gate.out] = state[gate.a] != state[gate.b]
			}
			visited[gate] = true
		}
	}
}

func getOutputWiresResult(
	state map[string]bool,
) string {
	i := 0
	result := ""
	for {
		value, ok := state[fmt.Sprintf("z%02d", i)]
		if !ok {
			break
		}
		if value {
			result = "1" + result
		} else {
			result = "0" + result
		}
		i++
	}

	return result
}

func findEndGate(wire string, gates []Gate) *string {
	validGates := make([]Gate, 0)
	for _, g := range gates {
		if g.a == wire || g.b == wire {
			if g.out[0] == 'z' {
				var number int
				number, _ = fmt.Sscanf(g.out, "z%d", &number)
				endWire := fmt.Sprintf("z%02d", number-1)
				return &endWire
			} else {
				validGates = append(validGates, g)
			}
		}
	}

	for _, g := range validGates {
		endWire := findEndGate(g.out, gates)
		if endWire != nil {
			return endWire
		}
	}

	return nil
}
