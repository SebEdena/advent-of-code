package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import adventofcode.utils.geometry.Coords
import adventofcode.utils.geometry.Direction
import adventofcode.utils.geometry.Grid

class Day07(input: Input) : AbstractDay(input) {

    private data class ManifoldDiagram(
        val grid: Grid,
        val start: Coords,
    )

    private fun parseInput(): ManifoldDiagram {
        val grid = Grid.fromInput(this.input.toStringListInput(""))
        val start = grid.getAllWithContent("S").first()
        return ManifoldDiagram(grid, start)
    }

    override fun part1(): Long {
        val data = this.parseInput()

        val coordsToCheck = mutableListOf(data.start)
        val checkedCoords = mutableSetOf<Coords>()

        val splittersMet = mutableSetOf<Coords>()

        while (coordsToCheck.isNotEmpty()) {
            val currentCoord = coordsToCheck.removeFirst()

            val nextCoords = when (data.grid.getItem(currentCoord)) {
                "S", "." -> {
                    mutableListOf(currentCoord.apply(Direction.SOUTH))
                }

                "^" -> {
                    splittersMet.add(currentCoord)
                    mutableListOf(
                        currentCoord.apply(Direction.SOUTH_EAST),
                        currentCoord.apply(Direction.SOUTH_WEST),
                    )
                }

                else -> emptyList()
            }

            for (next in nextCoords) {
                if (!data.grid.isValidCoord(next) || next in checkedCoords) continue
                coordsToCheck.add(next)
                checkedCoords.add(next)
            }
        }

        return splittersMet.size.toLong()
    }

    override fun part2(): Long {
        val data = this.parseInput()
        val bounds = data.grid.bounds()

        val coordsToCheck = mutableListOf(data.start)

        val pathCountMap = mutableMapOf<Coords, Long>()
        pathCountMap[data.start] = 1L

        val processedFrom = mutableMapOf<Coords, MutableSet<Coords>>()

        while (coordsToCheck.isNotEmpty()) {
            val currentCoord = coordsToCheck.removeFirst()
            val currentPaths = pathCountMap[currentCoord] ?: 1L

            val nextCoords = when (data.grid.getItem(currentCoord)) {
                "S", "." -> listOf(currentCoord.apply(Direction.SOUTH))
                "^" -> listOf(
                    currentCoord.apply(Direction.SOUTH_EAST),
                    currentCoord.apply(Direction.SOUTH_WEST),
                )

                else -> emptyList()
            }

            for (next in nextCoords) {
                if (!data.grid.isValidCoord(next)) continue

                val alreadyVisitedFrom = processedFrom.getOrPut(next) { mutableSetOf() }
                if (currentCoord in alreadyVisitedFrom) continue

                alreadyVisitedFrom.add(currentCoord)
                pathCountMap.merge(next, currentPaths, Long::plus)
                coordsToCheck.add(next)
            }
        }

        return pathCountMap
            .filter { it.key.y == bounds.y }
            .values
            .sum()
    }
}
