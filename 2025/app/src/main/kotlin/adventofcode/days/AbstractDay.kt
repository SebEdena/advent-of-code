package adventofcode.days

import adventofcode.utils.Input

abstract class AbstractDay(val input: Input): IDay {
    abstract override fun part1(): Long
    abstract override fun part2(): Long
}