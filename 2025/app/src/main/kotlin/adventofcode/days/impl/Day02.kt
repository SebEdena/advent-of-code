package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input

class Day02(input: Input) : AbstractDay(input) {

    private data class IdRange(val start: Long, val end: Long)

    private fun parseInput(): List<IdRange> {
        return this.input.toStringListInput(",").flatten()
            .map { str ->
                val match =
                    """^(?<start>\d+)-(?<end>\d+)$""".toRegex().find(str);
                IdRange(
                    match!!.groups["start"]!!.value.toLong(),
                    match.groups["end"]!!.value.toLong()
                )
            }
    }

    override fun part1(): Long {
        return this.parseInput()
            .map { range ->
                (range.start..range.end)
                    .filter { id ->
                        // Ceil forces to ignore ids with an odd number of digits
                        id.toString().length % 2 == 0 && isIdInvalid(id, id.toString().length / 2)
                    }
            }
            .flatten().sum()
    }

    override fun part2(): Long {
        return this.parseInput()
            .map { range ->
                (range.start..range.end)
                    .filter { id ->
                        isIdInvalid(id)
                    }
            }
            .flatten().sum()
    }

    private fun isIdInvalid(id: Long, minPatternLength: Int = 1): Boolean {
        val strId = id.toString()

        // Compute pattern lengths that will work for our id
        // It should be between 1 and the half of the id as string length
        // We filter the ones that will not be a multiple of the ids' string length
        // Reverse to find bigger patterns first
        val validPatternSizes = (minPatternLength..strId.length / 2)
            .filter { len -> strId.length % len == 0 }

        patLoop@ for (patternLength in validPatternSizes) {
            // Extract pattern from the first digits
            val pattern = strId.take(patternLength)

            // Try the pattern by sections of same length
            for (i in 1..<(strId.length / patternLength)) {
                val next = strId.substring(i * patternLength, (i + 1) * patternLength)
                if (next != pattern) {
                    continue@patLoop
                }
            }
            return true
        }

        return false
    }
}