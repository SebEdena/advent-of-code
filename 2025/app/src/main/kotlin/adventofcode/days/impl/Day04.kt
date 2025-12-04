package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import adventofcode.utils.geometry.Coords
import adventofcode.utils.geometry.Direction
import adventofcode.utils.geometry.Grid

class Day04(input: Input) : AbstractDay(input) {

    companion object {
        const val FORKLIFT_ROLLS_LIMIT = 4
    }

    private fun parseInput(): Grid {
        val data = this.input.toStringListInput("")
        return Grid.fromInput(data)
    }

    override fun part1(): Long {
        val grid = this.parseInput()

        return grid.getAllWithContent("@")
            .filter { coord -> getCloseRolls(grid, coord).size < FORKLIFT_ROLLS_LIMIT }
            .size.toLong()
    }

    override fun part2(): Long {
        val grid = this.parseInput()

        val rollCoords = grid.getAllWithContent("@")
        val removedRolls = mutableSetOf<Coords>()

        var rollsToCheck = rollCoords.toMutableSet()

        while (rollsToCheck.isNotEmpty()) {
            val newRollsToCheck = mutableSetOf<Coords>()
            val newRemovedRolls = mutableSetOf<Coords>()

            rollsToCheck
                .map { Pair(it, getCloseRolls(grid, it, removedRolls)) }
                .filter { it.second.size < FORKLIFT_ROLLS_LIMIT }
                .forEach {
                    newRemovedRolls.add(it.first)
                    newRollsToCheck.remove(it.first)
                    newRollsToCheck.addAll(it.second)
                }

            rollsToCheck = newRollsToCheck
            removedRolls.addAll(newRemovedRolls)
        }

        return removedRolls.size.toLong()
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
}