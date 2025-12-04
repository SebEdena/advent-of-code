package adventofcode.utils.geometry

import kotlin.math.max


class Grid(private val coordMap: Map<Coords, String>, val xMax: Int, val yMax: Int) {
    companion object {
        fun fromInput(data: List<List<String>>): Grid {
            val coordMap = mutableMapOf<Coords, String>()
            var xMax = 0
            var yMax = 0
            for (i in 0..<data.size) {
                yMax = max(yMax, data.size)
                for (j in 0..<data[i].size) {
                    xMax = max(xMax, data[i].size)
                    coordMap[Coords(j, i)] = data[i][j]
                }
            }
            return Grid(coordMap.toMap(), xMax, yMax)
        }
    }

    fun isValidCoord(coords: Coords) = coords in this.coordMap

    fun getItem(coords: Coords, direction: Direction? = null) =
        coordMap.getOrDefault(
            Coords(
                coords.x + (direction?.xOffset ?: 0),
                coords.y + (direction?.yOffset ?: 0),
            ), null
        )

    fun getAllWithContent(str: String) =
        coordMap.filter { it.value == str }.map { it.key }
            .toList()
            .sortedWith(compareBy({ it.y }, { it.x }))
}