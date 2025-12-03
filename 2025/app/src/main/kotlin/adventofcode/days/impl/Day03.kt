package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import kotlin.math.min

class Day03(input: Input) : AbstractDay(input) {

    private data class ArrangementParams(
        val sequence: String,
        val length: Int
    ) {
        companion object {
            fun make(bank: List<Int>, length: Int): ArrangementParams {
                return ArrangementParams(
                    bank.fold("") { acc, item -> acc + item },
                    length
                )
            }
        }
    }

    private fun parseInput(): List<List<Int>> {
        return this.input.toIntListInput("")
    }

    override fun part1(): Long {
        val data = this.parseInput()
        var result = 0L
        val memo = mutableMapOf<ArrangementParams, String?>()

        for (bank in data) {
            val arrangement = findBestArrangement(
                bank,
                2,
                memo
            )
            if (arrangement != null) {
                result += arrangement.toLong()
            }
        }

        return result
    }

    override fun part2(): Long {
        val data = this.parseInput()
        var result = 0L
        val memo = mutableMapOf<ArrangementParams, String?>()

        for (bank in data) {
            val arrangement = findBestArrangement(
                bank,
                12,
                memo
            )
            if (arrangement != null) {
                result += arrangement.toLong()
            }
        }

        return result
    }

    private fun findBestArrangement(
        bank: List<Int>,
        length: Int,
        memo: MutableMap<ArrangementParams, String?>
    ): String? {
        val memoKey = ArrangementParams.make(bank, length)
        if (memoKey in memo) {
            return memo[memoKey]
        }

        if (length == 0) {
            memo[memoKey] = ""
            return ""
        }

        val candidates = bank
            .mapIndexed { idx, item -> Pair(idx, item) }
            .fold(mutableListOf<Pair<Int, Int>>()) { acc, pair ->
                if (pair.first + length <= bank.size) {
                    acc.add(pair)
                }
                acc
            }
            .sortedWith(compareBy<Pair<Int, Int>> { -it.second }.thenBy { it.first })
            .toMutableList()

        while (candidates.isNotEmpty()) {
            val nextCandidate = candidates.removeAt(0)
            val index = nextCandidate.first
            val joltage = nextCandidate.second

            val arrangement = findBestArrangement(
                bank.subList(
                    min(
                        bank.size - 1,
                        index + 1
                    ), bank.size
                ),
                length - 1,
                memo
            )

            if (arrangement != null) {
                val result = joltage.toString() + arrangement
                memo[memoKey] = result
                return result
            }
        }

        memo[memoKey] = null
        return null
    }
}