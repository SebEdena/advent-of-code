package grids

type Coords struct {
	X, Y int
}

type Grid[T any] struct {
	data       map[Coords]T
	Rows, Cols int
}

func ValidCoordinates(coords Coords, rows, cols int) bool {
	return coords.X >= 0 && coords.X < rows && coords.Y >= 0 && coords.Y < cols
}

func (g *Grid[T]) ValidCoordinates(coords Coords) bool {
	return ValidCoordinates(coords, g.Rows, g.Cols)
}

func (g *Grid[T]) GetElement(coords Coords) T {
	return g.data[coords]
}

func ParseGrid[T any](input *[][]T) Grid[T] {
	dataMap := make(map[Coords]T)

	for i, row := range *input {
		for j, elt := range row {
			dataMap[Coords{X: i, Y: j}] = elt
		}
	}

	grid := Grid[T]{data: dataMap, Rows: len(*input)}
	if len(*input) > 0 {
		grid.Cols = len((*input)[0])
	}

	return grid
}
