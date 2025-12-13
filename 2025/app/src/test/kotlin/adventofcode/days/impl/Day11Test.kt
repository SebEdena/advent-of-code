package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class Day11Test {

    private fun setupDay(fileName: String): AbstractDay {
        return Day11(Input.fromFile(fileName))
    }

    @Test
    fun part1Test() {
        val day = setupDay("input_day11_test.txt")
        val expectedResult = 5L

        val result = day.part1()

        Assertions.assertEquals(expectedResult, result)
    }

    @Test
    fun part2Test() {
        val day = setupDay("input_day11p2_test.txt")
        val expectedResult = 2L

        val result = day.part2()

        Assertions.assertEquals(expectedResult, result)
    }
}
