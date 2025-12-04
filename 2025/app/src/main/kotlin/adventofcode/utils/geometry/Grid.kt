package adventofcode.utils.geometry


class Grid(private val coordMap: Map<Coords, String>) {
    companion object {
        fun fromInput(data: List<List<String>>): Grid {
            val coordMap = mutableMapOf<Coords, String>()
            for (i in 0..<data.size) {
                for (j in 0..<data[i].size) {
                    coordMap[Coords(j, i)] = data[i][j]
                }
            }
            return Grid(coordMap.toMap())
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