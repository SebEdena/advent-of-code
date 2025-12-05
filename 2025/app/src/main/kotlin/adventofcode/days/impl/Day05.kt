package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import com.google.common.primitives.Longs.max

class Day05(input: Input) : AbstractDay(input) {

    data class Pantry(val freshRanges: List<LongRange>, val ingredientIds: List<Long>)

    private fun parseInput(): Pantry {
        val data = this.input.toStringListInput().flatten()
        val freshRanges = mutableListOf<LongRange>()
        val ingredientIds = mutableListOf<Long>()
        for (row in data) {
            val items = row.split("-").map { it.toLong() }
            when (items.size) {
                1 -> ingredientIds.add(items[0])
                2 -> freshRanges.add(items[0]..items[1])
            }
        }
        return Pantry(freshRanges.toList(), ingredientIds.toList())
    }

    override fun part1(): Long {
        val pantry = this.parseInput()

        return pantry.ingredientIds
            .filter { ingredient -> pantry.freshRanges.any { ingredient in it } }
            .size.toLong()
    }

    override fun part2(): Long {
        val pantry = this.parseInput()

        return mergeRanges(pantry.freshRanges)
            .fold(0L) { count, ranges ->
                count + (ranges.last - ranges.first + 1)
            }
    }

    private fun mergeRanges(ranges: List<LongRange>): List<LongRange> {
        val sortedRanges = ranges.sortedBy { it.first }

        val resultRanges = mutableListOf<LongRange>()

        var currentRange = sortedRanges[0]

        for (i in 1..<sortedRanges.size) {
            val nextRange = sortedRanges[i]

            if (nextRange.first <= currentRange.last + 1) {
                currentRange = currentRange.first..max(currentRange.last, nextRange.last)
            } else {
                resultRanges.add(currentRange)
                currentRange = nextRange
            }
        }

        resultRanges.add(currentRange)

        return resultRanges
    }

}