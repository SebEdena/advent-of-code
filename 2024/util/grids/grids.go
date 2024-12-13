package grids

import (
	"strings"
)

type Grid [][]string
type Direction int
type Coords struct {
	X, Y int
}

const (
	NorthEast Direction = iota
	North
	NorthWest
	West
	SouthWest
	South
	SouthEast
	East
)

var Directions = map[Direction]Coords{
	NorthEast: {-1, 1},
	North:     {-1, 0},
	NorthWest: {-1, -1},
	West:      {0, -1},
	SouthWest: {1, -1},
	South:     {1, 0},
	SouthEast: {1, 1},
	East:      {0, 1},
}

func ApplyDirection(coords Coords, direction Direction) Coords {
	return Coords{coords.X + Directions[direction].X, coords.Y + Directions[direction].Y}
}

func ValidCoordinates(coords Coords, rows, cols int) bool {
	return coords.X >= 0 && coords.X < rows && coords.Y >= 0 && coords.Y < cols
}

func GetCharacter(grid *Grid, coords Coords) string {
	if ValidCoordinates(coords, len(*grid), len((*grid)[0])) {
		return ""
	}
	return (*grid)[coords.X][coords.Y]
}

func Rotate(direction Direction, angle int) Direction {
	if angle%90 != 0 {
		panic("Angle must be a multiple of 90")
	}

	rotation := 2 * (angle / 90)

	newDir := (int(direction) - rotation) % len(Directions)

	if newDir < 0 {
		return Direction(len(Directions) + newDir)
	} else {
		return Direction(newDir)
	}
}

func ParseGrid(input *string) (map[Coords]string, [2]int) {

	dataMap := make(map[Coords]string)
	var bounds [2]int

	rows := strings.Split(*input, "\n")
	for i, row := range rows {
		cols := strings.Split(strings.TrimSpace(row), "")

		for j, str := range cols {
			if i == 0 && j == 0 {
				bounds = [2]int{len(rows), len(cols)}
			}
			dataMap[Coords{X: i, Y: j}] = str
		}
	}

	return dataMap, bounds
}
