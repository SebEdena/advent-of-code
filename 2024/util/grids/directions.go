package grids

type Direction int

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
