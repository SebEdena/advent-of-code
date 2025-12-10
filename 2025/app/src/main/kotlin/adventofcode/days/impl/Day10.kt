package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import kotlin.math.absoluteValue

// https://github.com/romamik/aoc2025/blob/master/day10/day10p2.py

class Day10(input: Input) : AbstractDay(input) {

    private data class Diagram(
        val indicator: List<Boolean>,
        val buttons: List<List<Int>>,
        val joltage: List<Int>
    ) {
        fun buttonsAsInt(): List<Int> {
            val indicatorLength = indicator.size
            return buttons.map { button ->
                button.fold("0".repeat(indicatorLength)) { nb, index ->
                    nb.replaceRange(index..index, "1")
                }.toInt(2)
            }
        }

        fun indicatorAsInt(): Int {
            return indicator
                .map { if (it) '1' else '0' }
                .joinToString("").toInt(2)
        }
    }

    private fun parseInput(): List<Diagram> {
        val data = this.input.toStringListInput()

        return data.map { row ->
            val indicator = row.first().subSequence(1, row.first().length - 1).map { it == '#' }
            val buttons = row.subList(1, row.size - 1)
                .map { button ->
                    button.subSequence(1, button.length - 1)
                        .split(",")
                        .map { it.toInt() }
                }
            val joltage = row.last()
                .subSequence(1, row.last().length - 1)
                .split(",")
                .map { it.toInt() }

            Diagram(indicator, buttons, joltage)
        }
    }

    override fun part1(): Long {
        return this.parseInput().sumOf { diagram ->
            getButtonPressesToMatchIndicator(diagram) ?: 0L
        }
    }

    override fun part2(): Long {
        return this.parseInput().sumOf { diagram ->
            run {
                val matrix = prepareMatrix(diagram)

                val buttonPressRanges = computeButtonPressRanges(diagram, matrix)

                val reducedMatrix = reduceMatrix(diagram, matrix)

                val solution = searchSolution(
                    diagram,
                    reducedMatrix,
                    buttonPressRanges
                )

                solution?.sumOf { it ?: 0 }?.toLong() ?: 0L
            }
        }
    }

    private fun getButtonPressesToMatchIndicator(diagram: Diagram): Long? {
        val objective = diagram.indicatorAsInt()
        val visited = mutableSetOf(0)

        // Pair of (currentIndicator, numberOfButtonPresses)
        val stateToVisit = ArrayDeque<Pair<Int, Long>>()
        stateToVisit.add(Pair(0, 0L))

        while (stateToVisit.isNotEmpty()) {
            val (currentIndicator, buttonPresses) = stateToVisit.removeFirst()

            if (currentIndicator == objective) {
                return buttonPresses
            }

            for (button in diagram.buttonsAsInt()) {
                val newIndicator = currentIndicator xor button
                if (newIndicator !in visited) {
                    visited.add(newIndicator)
                    stateToVisit.add(Pair(newIndicator, buttonPresses + 1))
                }
            }
        }

        return null
    }

    fun gcd(numbers: List<Int>): Int {
        var result = numbers[0]
        for (i in 1 until numbers.size) {
            var num1 = result
            var num2 = numbers[i]
            while (num2 != 0) {
                val temp = num2
                num2 = num1 % num2
                num1 = temp
            }
            result = num1
        }
        return result
    }

    private fun prepareMatrix(
        diagram: Diagram
    ): MutableList<MutableList<Int>> {
        return (0..<diagram.joltage.size)
            .map { i ->
                diagram.buttons
                    .map { btn -> if (i in btn) 1 else 0 }
                    .plus(diagram.joltage[i])
                    .toMutableList()
            }.toMutableList()
    }

    private fun computeButtonPressRanges(
        diagram: Diagram, matrix: MutableList<MutableList<Int>>
    ): List<IntRange> {
        val buttonRanges = MutableList(diagram.buttons.size) { 0..Int.MAX_VALUE }

        for (counterId in diagram.joltage.indices) {
            for (buttonId in diagram.buttons.indices) {
                val target = diagram.joltage[counterId]
                if (matrix[counterId][buttonId] == 1 && buttonRanges[buttonId].last > target) {
                    buttonRanges[buttonId] = (0..target)
                }
            }
        }

        return buttonRanges
    }

    private fun reduceMatrix(
        diagram: Diagram,
        matrixInput: MutableList<MutableList<Int>>
    ): MutableList<MutableList<Int>> {
        val reducedMatrix = mutableListOf<MutableList<Int>>()

        val matrix = ArrayDeque(matrixInput)

        while (matrix.isNotEmpty()) {
            val current = matrix.removeLast()
            val button = current
                .take(diagram.buttons.size)
                .mapIndexed { idx, value -> Pair(idx, value) }
                .firstOrNull {
                    it.second != 0
                }?.first

            if (button == null) {
                if (current.last() != 0) {
                    throw Exception("No solution: row $current cannot reach target")
                }
                continue
            }

            for (row in matrix) {
                val a = current[button]
                val b = row[button]
                row.forEachIndexed { index, value ->
                    row[index] = value * a - current[index] * b
                }

                val gcd = gcd(row).absoluteValue
                if (gcd > 1) {
                    row.forEachIndexed { index, value ->
                        row[index] = value / gcd
                    }
                }
            }

            reducedMatrix.add(current)
        }

        return reducedMatrix
    }

    private fun substitute(
        diagram: Diagram,
        matrix: MutableList<MutableList<Int>>,
        knownValues: List<Int?>
    ): List<Int?>? {
        val newKnownValues = knownValues.toMutableList()

        for (row in matrix) {
            val target = row.last()
            var sum = 0
            val unknownIds = mutableListOf<Int>()
            for (buttonId in diagram.buttons.indices) {
                if (newKnownValues[buttonId] == null) {
                    if (row[buttonId] != 0) {
                        unknownIds.add(buttonId)
                    }
                } else {
                    sum += row[buttonId] * (newKnownValues[buttonId]!!)
                }
            }

            when (unknownIds.size) {
                0 -> {
                    if (sum != target) {
                        return null
                    }
                }

                1 -> {
                    val buttonId = unknownIds.last()
                    val remaining = target - sum
                    if (remaining % row[buttonId] != 0) {
                        return null
                    }
                    val value = remaining / row[buttonId]
                    if (value < 0) {
                        return null
                    }
                    newKnownValues[buttonId] = value
                }
            }
        }

        return newKnownValues
    }

    private fun searchSolution(
        diagram: Diagram,
        matrix: MutableList<MutableList<Int>>,
        bounds: List<IntRange>,
        knownValues: List<Int?> = List(diagram.buttons.size) { null },
        result: List<Int?>? = null
    ): List<Int?>? {
        val newKnownValues = substitute(diagram, matrix, knownValues)?.toMutableList()
            ?: return null
        var newResult = result?.toMutableList()

        val resultSum = newResult?.sumOf { it ?: 0 } ?: Int.MAX_VALUE
        val newKnownSum = newKnownValues.sumOf { it ?: 0 }

        if (newKnownSum > resultSum) {
            return null
        }

        if (newKnownValues.all { it != null }) {
            if (result == null || resultSum > newKnownSum) {
                return newKnownValues
            }
        }

        var selectedButtonId = -1
        var selectedButtonUnknownCount = diagram.buttons.size + 1
        for (row in matrix) {
            val unknownIds = mutableListOf<Int>()
            for (buttonId in diagram.buttons.indices) {
                if (newKnownValues[buttonId] == null && row[buttonId] != 0) {
                    unknownIds.add(buttonId)
                }
            }
            if (unknownIds.isNotEmpty() && (unknownIds.size < selectedButtonUnknownCount)) {
                selectedButtonId = unknownIds.last()
                selectedButtonUnknownCount = unknownIds.size
            }
        }

        if (selectedButtonId == -1) {
            return null
        }

        for (value in bounds[selectedButtonId]) {
            newKnownValues[selectedButtonId] = value
            val tmpResult = searchSolution(
                diagram,
                matrix,
                bounds,
                newKnownValues,
                newResult
            )?.toMutableList()
            if (tmpResult != null) {
                newResult = tmpResult
            }
        }

        return newResult
    }

}
