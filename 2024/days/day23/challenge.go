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
	data := io.ToStringSlice(input, "-")

	_, edges := buildGraph(data)

	validCycles := 0
	cycles := make(map[string]bool)

	for _, row := range *data {
		path := []string{row[0], row[1]}
		visited := map[string]bool{row[0]: true, row[1]: true}
		checkCycles(&path, &visited, &edges, &cycles, 3)
	}

	for cycle := range cycles {
		path := strings.Split(cycle, ",")
		if slices.ContainsFunc(path, func(s string) bool { return string(s[0]) == "t" }) {
			validCycles++
		}
	}

	return validCycles
}

func part2(input *string) string {
	data := io.ToStringSlice(input, "-")

	nodes, edges := buildGraph(data)

	cycles := make(map[string]bool)

	bronKerbosh(&[]string{}, &nodes, &[]string{}, &edges, &cycles)

	largestClique := ""
	for cycle := range cycles {
		if len(cycle) > len(largestClique) {
			largestClique = cycle
		}
	}

	return largestClique
}

func buildGraph(data *[][]string) ([]string, map[string][]string) {

	nodesMap := make(map[string]bool)
	edges := make(map[string][]string)

	for _, row := range *data {
		nodesMap[row[0]] = true
		if edges[row[0]] == nil {
			edges[row[0]] = []string{row[1]}
		} else if !slices.Contains(edges[row[0]], row[1]) {
			edges[row[0]] = append(edges[row[0]], row[1])
		}

		nodesMap[row[1]] = true
		if edges[row[1]] == nil {
			edges[row[1]] = []string{row[0]}
		} else if !slices.Contains(edges[row[1]], row[0]) {
			edges[row[1]] = append(edges[row[1]], row[0])
		}
	}

	nodes := make([]string, 0)
	for node := range nodesMap {
		nodes = append(nodes, node)
	}

	return nodes, edges
}

func key(list []string) string {
	slices.Sort(list)
	return strings.Join(list, ",")
}

func checkCycles(path *[]string,
	visited *map[string]bool,
	edges *map[string][]string,
	cycles *map[string]bool,
	length int) {

	start := (*path)[0]
	for _, next := range (*edges)[start] {
		if !(*visited)[next] {
			newPath := append([]string{next}, *path...)
			newVisited := make(map[string]bool)
			newVisited[next] = true
			for k, v := range *visited {
				newVisited[k] = v
			}
			if len(newPath) <= length {
				checkCycles(&newPath, &newVisited, edges, cycles, length)
			}
		} else if len(*path) == length && next == (*path)[len(*path)-1] {
			(*cycles)[key(*path)] = true
		}
	}

}

func bronKerbosh(R, P, X *[]string, edges *map[string][]string, cycles *map[string]bool) {
	if len(*P) == 0 && len(*X) == 0 {
		(*cycles)[key(*R)] = true
		return
	}

	for len(*P) > 0 {
		node := (*P)[0]
		newR := append(*R, node)
		newP := make([]string, 0)
		newX := make([]string, 0)

		for _, n := range *P {
			if slices.Contains((*edges)[node], n) {
				newP = append(newP, n)
			}
		}

		for _, n := range *X {
			if slices.Contains((*edges)[node], n) {
				newX = append(newX, n)
			}
		}

		bronKerbosh(&newR, &newP, &newX, edges, cycles)

		*P = (*P)[1:]
		*X = append(*X, node)
	}
}
