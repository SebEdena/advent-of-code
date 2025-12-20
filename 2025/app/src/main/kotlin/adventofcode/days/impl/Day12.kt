package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import adventofcode.utils.geometry.Coords
import kotlin.math.max

class Day12(input: Input) : AbstractDay(input) {

    private data class PresentShape(
        val shape: List<String>,
        val dimensions: Coords,
    ) {
        fun area() = dimensions.x * dimensions.y
    }

    private data class Region(
        val dimensions: Coords,
        val presentsQty: List<Int>,
    ) {
        fun area() = dimensions.x * dimensions.y
    }

    private fun parseInput(): Pair<List<PresentShape>, List<Region>> {
        val rawData = this.input.toRawStringList()

        val firstRegion = rawData.indexOfFirst { it.contains("x") }
        val presentData = rawData.subList(0, firstRegion)
        val regionData = rawData.subList(firstRegion, rawData.size)

        var currentShape: PresentShape? = null
        val presentShapes = mutableListOf<PresentShape>()
        for (line in presentData) {
            when {
                line.isEmpty() -> {
                    if (currentShape == null) continue
                    presentShapes.add(
                        currentShape
                    )
                }

                line.contains(":") -> {
                    currentShape = PresentShape(
                        shape = emptyList(),
                        dimensions = Coords(0, 0)
                    )
                }

                else -> {
                    if (currentShape == null) continue
                    currentShape = PresentShape(
                        shape = currentShape.shape + line,
                        dimensions = Coords(
                            x = max(currentShape.dimensions.x, line.length),
                            y = currentShape.shape.size + 1
                        )
                    )
                }
            }
        }

        val regions = regionData.map {
            val data = it.split(":")
            val presentsQty = data[1].trim().split(" ").map { q -> q.toInt() }
            val regionSize = data[0].split("x").map { dim -> dim.toInt() }
            Region(
                dimensions = Coords(regionSize[0], regionSize[1]),
                presentsQty = presentsQty
            )
        }

        return Pair(presentShapes, regions)
    }

    override fun part1(): Long {
        val (presentShapes, regions) = this.parseInput()

        val validRegions = regions.filter { region ->
            val regionArea = region.area()
            val presentArea = presentShapes
                .mapIndexed { index, shape ->
                    shape.area() * region.presentsQty[index]
                }.sum()
            regionArea >= presentArea
        }

        return validRegions.size.toLong()
    }

    override fun part2(): Long {
        return 0L
    }
}
