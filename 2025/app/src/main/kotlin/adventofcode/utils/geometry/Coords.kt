package adventofcode.utils.geometry

data class Coords(val x: Int, val y: Int) {
    fun apply(direction: Direction): Coords {
        return Coords(x + direction.xOffset, y + direction.yOffset)
    }
}