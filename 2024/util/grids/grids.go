package grids

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
