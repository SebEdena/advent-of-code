package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input

class Day01(input: Input) : AbstractDay(input) {

    companion object {
        const val DIAL_START_POSITION = 50
        const val DIAL_POSITIONS = 100
    }

    private enum class Direction(val label: String) {
        L("L"),
        R("R")
    }

    private data class Operation(val direction: Direction, val value: Int)

    private data class DialState(val position: Int, val cycles: Int)

    private fun parseInput(): List<Operation> {
        return this.input.toTypedInput { op: String ->
            val opPattern = """^(?<direction>[LR])(?<value>\d+)$""".toRegex()
            val result = opPattern.find(op)!!

            val direction = Direction.valueOf(result.groups["direction"]!!.value)
            val value = result.groups["value"]!!.value.toInt()

            Operation(direction, value)
        }.flatten()
    }

    override fun part1(): Long {
        val data = this.parseInput()

        val dialStates = this.processDial(DIAL_START_POSITION, DIAL_POSITIONS, data)

        return dialStates.count { dialState -> dialState.position == 0 }.toLong()
    }

    override fun part2(): Long {
        val data = this.parseInput()

        val dialStates = this.processDial(DIAL_START_POSITION, DIAL_POSITIONS, data)

        return dialStates.fold(0L)  { acc, dial  ->
            acc + (dial.cycles + if (dial.position == 0) 1 else 0).toLong()
        }
    }

    private fun processDial(start: Int, positions: Int, operations: List<Operation>): List<DialState> {
        var currentPosition = start
        val dialStates = mutableListOf<DialState>()

        for (operation in operations) {
            var cycles: Int
            var newPosition: Int
            when (operation.direction) {
                Direction.L -> {
                   newPosition = (currentPosition - (operation.value % positions))
                   cycles = (operation.value) / positions
                }
                Direction.R -> {
                    newPosition = (currentPosition + (operation.value % positions))
                    cycles = (operation.value) / positions
                }
            }

            if (newPosition < 0) {
                newPosition += positions
                if (newPosition != 0 && currentPosition != 0) {
                    cycles++
                }
            }

            if (newPosition >= positions) {
                newPosition -= positions
                if (newPosition != 0 && currentPosition != 0) {
                    cycles++
                }
            }

            dialStates.add(DialState(newPosition, cycles))
            currentPosition = newPosition
        }

        return dialStates.toList()
    }
}