package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import guru.nidi.graphviz.attribute.Color
import guru.nidi.graphviz.attribute.Style
import guru.nidi.graphviz.engine.Format
import guru.nidi.graphviz.engine.Graphviz
import guru.nidi.graphviz.graph
import guru.nidi.graphviz.model.Factory.mutNode
import java.io.File

/**
 * Solution for Day 11: Graph Path Counting
 *
 * This problem involves counting paths in a directed acyclic graph (DAG).
 * Part 1: Count all paths from "you" to "out"
 * Part 2: Count paths that pass through specific mandatory nodes in order
 */
class Day11(input: Input) : AbstractDay(input) {

    /**
     * Parses the input into a graph represented as an adjacency list.
     *
     * Input format: Each line contains a node name followed by its successors
     * Example: "nodeA: nodeB nodeC nodeD"
     *
     * @return A map where keys are node names and values are lists of successor node names
     */
    private fun parseInput(): MutableMap<String, List<String>> {
        // Map to (node name) -> (list of successor node names)
        return this.input.toStringListInput()
            .associate { Pair(it[0].take(it[0].length - 1), it.subList(1, it.size)) }
            .plus(Pair("out", listOf())) // Ensure "out" exists as a terminal node
            .toMutableMap()
    }

    /**
     * Part 1: Count all possible paths from "you" to "out" in the graph.
     *
     * Uses topological sorting and dynamic programming to efficiently count paths
     * in O(V + E) time complexity.
     *
     * @return The total number of distinct paths from "you" to "out"
     */
    override fun part1(): Long {
        val successorsMap = this.parseInput()

        val ancestorsMap = getAncestorNodesMap(successorsMap)

        // Enable to visualize the graph
        // drawGraph(successorsMap, successorsMap.keys, "day11_part1_graph.svg")

        return countPaths(successorsMap, ancestorsMap, "you", "out")
    }

    /**
     * Part 2: Count paths from "svr" to "out" that pass through mandatory nodes in order.
     *
     * Algorithm:
     * 1. Identify all nodes reachable from mandatory nodes (prune irrelevant nodes)
     * 2. Sort mandatory nodes by topological order
     * 3. Count paths between consecutive mandatory nodes
     * 4. Multiply counts to get total paths (multiplication principle)
     *
     * The graph is pruned to only include nodes that lie on paths through all mandatory nodes,
     * significantly improving performance.
     *
     * @return The total number of paths from "svr" to "out" passing through all mandatory nodes
     */
    override fun part2(): Long {
        val successorsMap = this.parseInput()

        val ancestorsMap = getAncestorNodesMap(successorsMap)

        // Find nodes relevant to paths through mandatory nodes and sort them topologically
        val (linkedNodes, mandatoryNodes) = getLinkedNodes(successorsMap, ancestorsMap, listOf("fft", "dac"))

        // Prune the graph to only include relevant nodes
        val prunedSuccessorsMap = successorsMap.entries
            .filter { it.key in linkedNodes }
            .associate { Pair(it.key, it.value.filter { v -> v in linkedNodes }) }

        val prunedAncestorsMap = ancestorsMap.entries
            .filter { it.key in linkedNodes }
            .associate { Pair(it.key, it.value.filter { v -> v in linkedNodes }) }

        // Enable to visualize the pruned graph
        // drawGraph(successorsMap, linkedNodes, "day11_part2_graph.svg")

        // Count paths from "svr" to first mandatory node
        var result = countPaths(
            prunedSuccessorsMap,
            prunedAncestorsMap,
            "svr",
            mandatoryNodes.first()
        )

        // Count paths between consecutive mandatory nodes and multiply
        for (i in 0 until mandatoryNodes.size - 1) {
            result *= countPaths(
                prunedSuccessorsMap,
                prunedAncestorsMap,
                mandatoryNodes[i],
                mandatoryNodes[i + 1]
            )
        }

        // Count paths from last mandatory node to "out"
        result *= countPaths(
            prunedSuccessorsMap,
            prunedAncestorsMap,
            mandatoryNodes.last(),
            "out"
        )

        return result
    }

    /**
     * Draws the directed graph represented by the given data and saves it to an SVG file.
     *
     * Special nodes are colored:
     * - "you": Red (start node for part 1)
     * - "svr": Blue (start node for part 2)
     * - "fft": Orange (mandatory node)
     * - "dac": Yellow (mandatory node)
     * - "out": Green (end node)
     *
     * Nodes in includedNodes are drawn in black, others in light gray.
     * Edges between included nodes are black, others are light gray.
     *
     * @param data The graph as an adjacency list (successors map)
     * @param includedNodes Set of nodes to highlight (typically after pruning)
     * @param outputFileName The output SVG file path
     */
    private fun drawGraph(data: Map<String, List<String>>, includedNodes: Set<String>, outputFileName: String) {
        // Define colors for special nodes
        val nodeColors = mapOf(
            "you" to listOf(Style.FILLED, Color.RED),
            "svr" to listOf(Style.FILLED, Color.BLUE),
            "fft" to listOf(Style.FILLED, Color.ORANGE),
            "dac" to listOf(Style.FILLED, Color.YELLOW),
            "out" to listOf(Style.FILLED, Color.GREEN)
        )

        // Create mutable nodes with appropriate styling
        val nodes = data.keys.associateWith { v ->
            mutNode(v).apply {
                val nodeColors = nodeColors[v]
                if (nodeColors != null) {
                    // Special node: use predefined color
                    nodeColors.forEach { add(it) }
                } else {
                    if (v in includedNodes) {
                        // Included node: black border, white fill
                        add(Color.BLACK.font(), Style.FILLED, Color.WHITE, Style.SOLID, Color.BLACK)
                    } else {
                        // Excluded node: gray (pruned from graph)
                        add(Color.LIGHTGRAY.font(), Style.FILLED, Color.WHITE, Style.SOLID, Color.LIGHTGRAY)
                    }
                }
            }
        }

        // Build the graph
        val graph = graph(directed = true)
        graph.add(nodes.values.toList())

        // Add edges with appropriate colors
        for ((from, tos) in data) {
            val a = nodes[from]!!

            for (to in tos) {
                val b = nodes[to]!!
                // Edge is black if both nodes are included, gray otherwise
                val color = if (from in includedNodes && to in includedNodes) Color.BLACK else Color.LIGHTGRAY
                a.addLink(b.linkTo().with(color))
            }
        }

        // Render and save to file
        Graphviz
            .fromGraph(graph)
            .width(1200)
            .render(Format.SVG_STANDALONE)
            .toFile(File(outputFileName))
    }

    /**
     * Builds the reverse adjacency list (predecessor/ancestor map) from the successor map.
     *
     * For each edge (parent -> child) in the successor map, adds (child -> parent)
     * to the ancestor map.
     *
     * Time complexity: O(E) where E is the number of edges
     *
     * @param data The graph as a successor adjacency list
     * @return A map where keys are node names and values are lists of predecessor node names
     */
    private fun getAncestorNodesMap(data: Map<String, List<String>>): Map<String, List<String>> {
        val ancestorMap = mutableMapOf<String, MutableList<String>>()
        for ((parent, children) in data) {
            for (child in children) {
                ancestorMap.computeIfAbsent(child) { mutableListOf() }.add(parent)
            }
        }
        return ancestorMap
    }

    /**
     * Finds all nodes that are part of paths through the mandatory nodes and sorts them topologically.
     *
     * Algorithm:
     * 1. For each mandatory node:
     *    - Find all ancestors (nodes that can reach it via BFS backwards)
     *    - Find all successors (nodes reachable from it via BFS forwards)
     * 2. Intersect all these sets to find nodes common to all mandatory node paths
     * 3. Sort mandatory nodes by topological order based on their relationships
     *
     * This pruning is crucial for performance as it reduces the graph size significantly.
     *
     * Time complexity: O(M * (V + E)) where M is the number of mandatory nodes
     *
     * @param successors The graph as a successor adjacency list
     * @param ancestors The graph as a predecessor adjacency list
     * @param mandatoryNodes List of node names that must be visited
     * @return A pair of (set of relevant nodes, topologically sorted mandatory nodes)
     */
    private fun getLinkedNodes(
        successors: Map<String, List<String>>,
        ancestors: Map<String, List<String>>,
        mandatoryNodes: List<String>
    ): Pair<Set<String>, List<String>> {
        var allLinkedNodes: Set<String>? = null
        var mandatoryNodesSorted = mandatoryNodes.toList()

        for (node in mandatoryNodes) {
            val toVisit = ArrayDeque<String>()

            // Ancestors traversal: Find all nodes that can reach this mandatory node
            val visitedAncestors = mutableSetOf<String>()
            toVisit.add(node)

            while (toVisit.isNotEmpty()) {
                val currentNode = toVisit.removeFirst()

                if (currentNode !in visitedAncestors) {
                    visitedAncestors.add(currentNode)
                    toVisit.addAll((ancestors[currentNode] ?: listOf()).filter { it !in visitedAncestors })
                }
            }

            // Successors traversal: Find all nodes reachable from this mandatory node
            val visitedSuccessors = mutableSetOf<String>()
            toVisit.add(node)

            while (toVisit.isNotEmpty()) {
                val currentNode = toVisit.removeFirst()

                if (currentNode !in visitedSuccessors) {
                    visitedSuccessors.add(currentNode)
                    toVisit.addAll((successors[currentNode] ?: listOf()).filter { it !in visitedSuccessors })
                }
            }

            // Sort mandatory nodes based on their topological relationships
            mandatoryNodesSorted = mandatoryNodesSorted.sortedWith { a, b ->
                val aIn = (a in visitedAncestors) || (a in visitedSuccessors)
                val bIn = (b in visitedAncestors) || (b in visitedSuccessors)
                when {
                    aIn && !bIn -> -1
                    !aIn && bIn -> 1
                    else -> 0
                }
            }.toList()

            // Intersect with previous results to find common nodes
            allLinkedNodes = allLinkedNodes?.intersect(visitedAncestors + visitedSuccessors)
                ?: (visitedAncestors + visitedSuccessors)
        }

        return Pair(allLinkedNodes ?: setOf(), mandatoryNodesSorted)
    }


    /**
     * Counts the number of distinct paths from start to end in a DAG using dynamic programming.
     *
     * Algorithm:
     * 1. Compute in-degrees for all nodes using the ancestor map
     * 2. Perform topological sort using Kahn's algorithm (BFS-based)
     * 3. Use dynamic programming: for each node in topological order,
     *    propagate its path count to all successors
     * 4. Return the path count at the end node
     *
     * This approach is optimal for DAGs with:
     * - Time complexity: O(V + E)
     * - Space complexity: O(V)
     *
     * The algorithm leverages the fact that in a topologically sorted order,
     * when we process a node, all paths to it have already been counted.
     *
     * @param successorMap The graph as a successor adjacency list
     * @param ancestorMap The graph as a predecessor adjacency list (used for in-degree calculation)
     * @param start The starting node name
     * @param end The ending node name
     * @return The number of distinct paths from start to end
     */
    private fun countPaths(
        successorMap: Map<String, List<String>>,
        ancestorMap: Map<String, List<String>>,
        start: String,
        end: String,
    ): Long {
        // Calculate in-degrees for all nodes
        val inDegree = mutableMapOf<String, Int>()

        inDegree.putAll(
            ((successorMap.keys + successorMap.values.flatten())
                .map { Pair(it, if (it == start) 0 else ancestorMap[it]?.size ?: 0) }
                .sortedBy { it.second })
        )

        // Topological sort using Kahn's algorithm
        val queue = ArrayDeque(inDegree.filter { it.value == 0 }.keys)
        val topoOrder = mutableListOf<String>()

        while (queue.isNotEmpty()) {
            val node = queue.removeFirst()
            topoOrder.add(node)

            // Reduce in-degree for all successors
            for (next in successorMap[node] ?: listOf()) {
                inDegree[next] = inDegree[next]!! - 1
                if (inDegree[next] == 0) {
                    queue.add(next)
                }
            }
        }

        // Dynamic programming: count paths
        val pathCount = mutableMapOf<String, Long>()
        pathCount[start] = 1L // Base case: one path to start node (the empty path)

        for (node in topoOrder) {
            val count = pathCount[node] ?: continue

            if (node == end) continue // Don't propagate beyond the end node

            // Propagate path count to all successors
            successorMap[node]?.forEach { next ->
                pathCount[next] = pathCount.getOrDefault(next, 0L) + count
            }
        }

        return pathCount[end] ?: 0L
    }
}
