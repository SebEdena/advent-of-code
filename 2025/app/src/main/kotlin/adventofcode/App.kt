package adventofcode

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import kotlin.reflect.KClass
import kotlin.reflect.full.primaryConstructor

fun main() {
    println("Hello, Advent of Code!")

    println("Which day do you want to run?")
    val day = readln().toInt()

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
    val part = readln().toInt()

    val result: Long = when (part) {
        1 -> dayInstance.part1()
        2 -> dayInstance.part2()
        else -> throw IllegalArgumentException("Invalid part: $part")
    }

    println("Result for Day $day Part $part: $result")
}