package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class Day09Test {

    private fun setupDay(fileName: String): AbstractDay {
        return Day09(Input.fromFile(fileName))
    }

    @Test
    fun part1Test() {
        val day = setupDay("input_day09_test.txt")
        val expectedResult = 50L

        val result = day.part1()

        Assertions.assertEquals(expectedResult, result)
    }

    @Test
    fun part2Test() {
        val day = setupDay("input_day09_test.txt")
        val expectedResult = 24L

        val result = day.part2()

        Assertions.assertEquals(expectedResult, result)
    }
}
