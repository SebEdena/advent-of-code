package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class Day12Test {

    private fun setupDay(fileName: String): AbstractDay {
        return Day12(Input.fromFile(fileName))
    }

    @Test
    fun part1Test() {
        val day = setupDay("input_day12_test.txt")

        // This is the result for the "simple" test input solving method so does not
        // match the actual result from the Advent of Code website.
        val expectedResult = 1L

        val result = day.part1()

        Assertions.assertEquals(expectedResult, result)
    }
}
