package math

import "aoc-2024/util/grids"

func Abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func SameSign(a, b int) bool {
	return (a < 0) == (b < 0)
}

func ManhattanDistance(a, b grids.Coords) int {
	return Abs(a.X-b.X) + Abs(a.Y-b.Y)
}
