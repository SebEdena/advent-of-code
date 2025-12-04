package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import adventofcode.utils.geometry.Coords
import adventofcode.utils.geometry.Direction
import adventofcode.utils.geometry.Grid

class Day04(input: Input) : AbstractDay(input) {

    private fun parseInput(): Grid {
        val data = this.input.toStringListInput("")
        return Grid.fromInput(data)
    }

    override fun part1(): Long {
        val grid = this.parseInput()

        val rollCoords = grid.getAllWithContent("@")
            .filter { coord -> canAccessRoll(grid, coord) }
            .size

        return rollCoords.toLong()
    }

    override fun part2(): Long {
        val grid = this.parseInput()

        val rollCoords = grid.getAllWithContent("@")
        val removedRolls = mutableSetOf<Coords>()

        while (true) {
            val newRemovedRolls = mutableSetOf<Coords>()
            for (coord in rollCoords.filter { it !in removedRolls }) {
                if (canAccessRoll(grid, coord, removedRolls)) {
                    removedRolls.add(coord)
                    newRemovedRolls.add(coord)
                }
            }
            if (newRemovedRolls.isEmpty()) {
                return removedRolls.size.toLong()
            }
        }
    }

    private fun getCloseRolls(grid: Grid, coords: Coords, removedRolls: Set<Coords> = setOf()) =
        Direction.entries.map { coords.apply(it) }.filter { c ->
            if (c in removedRolls) {
                false
            } else {
                val item = grid.getItem(c)
                item != null && item == "@"
            }
        }.toSet()

    private fun canAccessRoll(grid: Grid, coords: Coords, removedRolls: Set<Coords> = setOf()) =
        getCloseRolls(grid, coords, removedRolls).size < 4
}