package math

func Abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func SameSign(a, b int) bool {
	return (a < 0) == (b < 0)
}
