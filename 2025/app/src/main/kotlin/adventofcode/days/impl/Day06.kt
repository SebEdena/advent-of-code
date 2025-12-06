package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input

class Day06(input: Input) : AbstractDay(input) {

    private class Operation(val operands: List<Long>, val operator: Char) {
        fun execute(): Long {
            return when (operator) {
                '+' -> operands.sum()
                '*' -> operands.reduce { acc, l -> acc * l }
                else -> throw IllegalArgumentException("Unknown operator: $operator")
            }
        }
    }

    override fun part1(): Long {
        val data = this.input.toStringListInput()

        val operations = mutableListOf<Operation>()

        if (data.isEmpty()) {
            return 0L
        }

        for (i in data[0].indices) {
            val elements = data.map { row -> row[i] }
            operations.add(
                Operation(
                    elements.subList(0, elements.size - 1).map { it.toLong() },
                    elements.last().first()
                )
            )
        }

        return operations.sumOf { it.execute() }
    }

    override fun part2(): Long {
        val data = this.input.toRawStringList()
        val operandsData = data.subList(0, data.size - 1)
        val operatorsData = data.last()

        // Start from the end of operators line
        var cursor = operatorsData.indices.last()

        // Initialize operation start index to the end of the line
        // Last index can be different so we take the max of all lines
        var operationStartIndex = data.maxOf { it.indices.last() }

        val operations = mutableListOf<Operation>()

        // Traverse the operators line backwards
        while (cursor >= 0) {
            when (data.last()[cursor]) {
                // Operator found
                '+', '*' -> {
                    val operands = (operationStartIndex downTo cursor) // Reverse range !
                        .map { i ->
                            operandsData
                                .map { it.getOrElse(i) { _ -> ' ' } } // Guardrail for shorter lines
                                .fold("") { str, char -> str + char } // Assemble string operand
                                .trim() // Clean spaces to prevent exceptions
                                .toLong()
                        }

                    val operator = data.last()[cursor]

                    operations.add(Operation(operands, operator))

                    cursor -= 2 // Skip next space
                    operationStartIndex = cursor // Reset operation start index
                }

                ' ' -> {
                    cursor-- // Continue to next character
                }
            }
        }

        return operations.sumOf { it.execute() }
    }
}
