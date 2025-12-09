package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import adventofcode.utils.geometry.Coords

class Day09(input: Input) : AbstractDay(input) {

    private data class Rectangle(
        val min: Coords,
        val max: Coords,
        val area: Long,
    )

    private fun parseInput(): List<Coords> {
        return this.input.toIntListInput(",")
            .filter { it.size >= 2 }
            .map { Coords(it[0], it[1]) }
    }

    override fun part1(): Long {
        val edges = this.parseInput()

        val rectangles = buildAllRectangles(edges)

        return rectangles
            .maxOf { it.area }
    }

    override fun part2(): Long {
        val edges = this.parseInput()

        val rectangles = buildAllRectangles(edges)

        return rectangles
            .filter { !rectangleIntersects(it, edges) }
            .maxOf { it.area }
    }

    private fun minmax(a: Coords, b: Coords): Pair<Coords, Coords> {
        val min = Coords(
            x = minOf(a.x, b.x),
            y = minOf(a.y, b.y),
        )
        val max = Coords(
            x = maxOf(a.x, b.x),
            y = maxOf(a.y, b.y),
        )
        return Pair(min, max)
    }

    private fun buildAllRectangles(edges: List<Coords>): List<Rectangle> {
        val rectangles = mutableListOf<Rectangle>()

        for (i in edges.indices) {
            for (j in i + 1 until edges.size) {
                val (min, max) = minmax(edges[i], edges[j])
                val area = (max.x - min.x + 1).toLong() * (max.y - min.y + 1).toLong()

                rectangles.add(
                    Rectangle(
                        min,
                        max,
                        area
                    )
                )
            }
        }

        return rectangles
    }

    private fun rectangleIntersects(
        rectangle: Rectangle,
        tiles: List<Coords>
    ): Boolean {
        val minRect = rectangle.min
        val maxRect = rectangle.max

        for (i in tiles.indices) {
            val (minTile, maxTile) = minmax(tiles[i], tiles[(i + 1) % tiles.size])
            if (minRect.x + 1 > maxTile.x || maxRect.x - 1 < minTile.x
                || minRect.y + 1 > maxTile.y || maxRect.y - 1 < minTile.y
            ) {
                continue
            }
            return true
        }

        return false
    }

}
