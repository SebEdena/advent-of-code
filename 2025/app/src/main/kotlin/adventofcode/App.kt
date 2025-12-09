package adventofcode

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import kotlin.reflect.KClass
import kotlin.reflect.full.primaryConstructor
import kotlin.system.measureTimeMillis

fun verifyIntIsInRange(input: String, range: IntRange): Int {
    val dayNum: Int
    try {
        dayNum = input.toInt()
    } catch (_: NumberFormatException) {
        throw NumberFormatException("Day must be an integer")
    }
    if (dayNum in range) {
        return dayNum
    } else {
        throw NumberFormatException(
            "Day must be between an integer between " +
                    "${range.first} and ${range.last}."
        )
    }
}

fun waitForIntInput(prompt: String, verify: (input: String) -> Int): Int {
    while (true) {
        println(prompt)
        val input = readln()
        try {
            return verify(input)
        } catch (e: NumberFormatException) {
            println(e.message)
        }
    }
}

fun main() {
    println("Hello, Advent of Code!")

    println("Which day do you want to run?")
    val day = waitForIntInput("Enter day number (1-12):") {
        verifyIntIsInRange(it, 1..12)
    }

    val dayClass: KClass<out AbstractDay> = try {
        Class
            .forName("adventofcode.days.impl.Day%02d".format(day))
            .kotlin as KClass<out AbstractDay>
    } catch (_: ClassNotFoundException) {
        throw IllegalStateException("Cannot run day $day : it does not exist")
    }

    val dayInstance = dayClass.primaryConstructor?.let { constructor ->
        val input = Input.fromFile("input_day%02d.txt".format(day))
        val dayInstance = constructor.call(input)
        dayInstance
    } ?: throw IllegalStateException("Cannot run day $day : it does not exist")

    println("Which part do you want to run?")
    val part = waitForIntInput("Enter part (1-2):") {
        verifyIntIsInRange(it, 1..2)
    }

    var result: Long = 0
    val elapsedMs = measureTimeMillis {
        result = when (part) {
            1 -> dayInstance.part1()
            2 -> dayInstance.part2()
            else -> throw IllegalArgumentException("Invalid part: $part")
        }
    }

    val elapsedSec = elapsedMs / 1000.0

    println("Result for Day $day Part $part: $result")
    println("Execution time: %.3f s".format(elapsedSec))
}