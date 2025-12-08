package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sqrt

class Day08(input: Input) : AbstractDay(input) {

    private data class Coords3D(val x: Int, val y: Int, val z: Int)

    private fun parseInput(): List<Coords3D> {
        return this.input.toIntListInput(",")
            .filter { it.size >= 3 }
            .map { Coords3D(it[0], it[1], it[2]) }
    }

    override fun part1(): Long {
        val data = this.parseInput()
        val maxJunctions = 1000

        val distanceMap = computeDistancesMatrix(data, ::euclideanDistance)

        val vertexGroups = initVertexGroups(data)

        val edges = distanceMap.entries.sortedBy { it.value }.map { it.key }.toMutableList()

        var junctions = 0;

        while (junctions < maxJunctions) {
            val currentEdge = edges.removeFirstOrNull() ?: break

            mergeVertexGroups(vertexGroups, currentEdge.first, currentEdge.second)

            junctions++
        }

        return vertexGroups
            .entries
            .groupingBy { it.value }
            .eachCount()
            .entries
            .sortedByDescending { it.value }
            .take(3)
            .fold(1L) { acc, entry -> acc * entry.value }
    }

    override fun part2(): Long {
        val data = this.parseInput()

        val distanceMap = computeDistancesMatrix(data, ::euclideanDistance)

        val vertexGroups = initVertexGroups(data)

        val edges = distanceMap.entries.sortedBy { it.value }.map { it.key }.toMutableList()
        var currentEdge = edges.removeFirstOrNull()

        while (currentEdge != null &&
            vertexGroups.entries.groupingBy { it.value }.eachCount().size > 1
        ) {
            mergeVertexGroups(vertexGroups, currentEdge.first, currentEdge.second)

            if (vertexGroups.entries.groupingBy { it.value }.eachCount().size == 1) break

            currentEdge = edges.removeFirstOrNull()
        }

        return ((currentEdge?.first?.x ?: 0) * (currentEdge?.second?.x ?: 0)).toLong()
    }

    private fun computeDistancesMatrix(
        data: List<Coords3D>,
        distanceFunction: (c1: Coords3D, c2: Coords3D) -> Double
    ): MutableMap<Pair<Coords3D, Coords3D>, Double> {
        val distanceMap = mutableMapOf<Pair<Coords3D, Coords3D>, Double>()

        data.forEach { c1 ->
            data.forEach { c2 ->
                run {
                    if (c1 != c2 &&
                        !distanceMap.containsKey(Pair(c1, c2)) &&
                        !distanceMap.containsKey(Pair(c2, c1))
                    ) {
                        distanceMap[Pair(c1, c2)] = distanceFunction(c1, c2)
                    }
                }
            }
        }

        return distanceMap.toMutableMap()
    }

    private fun euclideanDistance(a: Coords3D, b: Coords3D) = sqrt(
        (b.x - a.x).toDouble().pow(2) +
                (b.y - a.y).toDouble().pow(2) +
                (b.z - a.z).toDouble().pow(2)
    )

    private fun initVertexGroups(data: List<Coords3D>): MutableMap<Coords3D, Int> {
        return data
            .mapIndexed { idx, it -> Pair(it, idx) }
            .toMap()
            .toMutableMap()
    }

    private fun mergeVertexGroups(
        vertexGroups: MutableMap<Coords3D, Int>,
        c1: Coords3D,
        c2: Coords3D
    ) {
        val groupIdMin = min(vertexGroups[c1]!!, vertexGroups[c2]!!)
        val groupIdMax = max(vertexGroups[c1]!!, vertexGroups[c2]!!)

        vertexGroups.entries.filter { it.value == groupIdMax }
            .forEach { vertexGroups[it.key] = groupIdMin }
    }
}
