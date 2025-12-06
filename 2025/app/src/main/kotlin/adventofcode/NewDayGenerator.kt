package adventofcode

import java.io.File

/**
 * Script to generate boilerplate code for a new Advent of Code day.
 *
 * Usage: Run with a day number as argument
 * Example: ./gradlew run --args="generate 5"
 *
 * Or run directly: kotlin NewDayGenerator.kt 5
 */
object NewDayGenerator {

    private val projectRoot = findProjectRoot()

    private fun findProjectRoot(): File {
        var dir = File(System.getProperty("user.dir"))
        while (dir.parentFile != null) {
            if (File(dir, "settings.gradle.kts").exists() || File(dir, "build.gradle.kts").exists()) {
                // Check if this is the app module or root
                if (File(dir, "app").exists()) {
                    return dir
                }
                // We're in the app module, go up one level
                if (dir.name == "app") {
                    return dir.parentFile
                }
                return dir
            }
            dir = dir.parentFile
        }
        return File(System.getProperty("user.dir"))
    }

    private fun getDayFileName(dayNumber: Int): String {
        return "Day${dayNumber.toString().padStart(2, '0')}"
    }

    private fun getInputFileName(dayNumber: Int): String {
        return "input_day${dayNumber.toString().padStart(2, '0')}"
    }

    private fun generateDayClass(dayNumber: Int): String {
        val dayName = getDayFileName(dayNumber)
        return """package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input

class $dayName(input: Input) : AbstractDay(input) {

    private fun parseInput(): List<List<String>> {
        return this.input.toStringListInput()
    }

    override fun part1(): Long {
        val data = this.parseInput()
        
        // TODO: Implement part 1
        return 0L
    }

    override fun part2(): Long {
        val data = this.parseInput()
        
        // TODO: Implement part 2
        return 0L
    }
}
"""
    }

    private fun generateTestClass(dayNumber: Int): String {
        val dayName = getDayFileName(dayNumber)
        val inputFileName = getInputFileName(dayNumber)
        return """package adventofcode.days.impl

import adventofcode.days.AbstractDay
import adventofcode.utils.Input
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class ${dayName}Test {

    private fun setupDay(fileName: String): AbstractDay {
        return $dayName(Input.fromFile(fileName))
    }

    @Test
    fun part1Test() {
        val day = setupDay("${inputFileName}_test.txt")
        val expectedResult = 0L

        val result = day.part1()

        Assertions.assertEquals(expectedResult, result)
    }

    @Test
    fun part2Test() {
        val day = setupDay("${inputFileName}_test.txt")
        val expectedResult = 0L

        val result = day.part2()

        Assertions.assertEquals(expectedResult, result)
    }
}
"""
    }

    fun generate(dayNumber: Int) {
        require(dayNumber in 1..25) { "Day number must be between 1 and 25" }

        val dayName = getDayFileName(dayNumber)
        val inputFileName = getInputFileName(dayNumber)

        val appDir = File(projectRoot, "app")

        // Define file paths
        val dayClassFile = File(appDir, "src/main/kotlin/adventofcode/days/impl/$dayName.kt")
        val testClassFile = File(appDir, "src/test/kotlin/adventofcode/days/impl/${dayName}Test.kt")
        val inputFile = File(appDir, "src/main/resources/$inputFileName.txt")
        val testInputFile = File(appDir, "src/test/resources/${inputFileName}_test.txt")

        // Check if files already exist
        val existingFiles = listOf(dayClassFile, testClassFile, inputFile, testInputFile)
            .filter { it.exists() }

        if (existingFiles.isNotEmpty()) {
            println("⚠️  Warning: The following files already exist:")
            existingFiles.forEach { println("   - ${it.absolutePath}") }
            print("Do you want to overwrite them? (y/N): ")
            val response = readLine()?.trim()?.lowercase()
            if (response != "y" && response != "yes") {
                println("❌ Generation cancelled.")
                return
            }
        }

        // Create directories if they don't exist
        dayClassFile.parentFile.mkdirs()
        testClassFile.parentFile.mkdirs()
        inputFile.parentFile.mkdirs()
        testInputFile.parentFile.mkdirs()

        // Generate files
        dayClassFile.writeText(generateDayClass(dayNumber))
        println("✅ Created: ${dayClassFile.relativeTo(projectRoot)}")

        testClassFile.writeText(generateTestClass(dayNumber))
        println("✅ Created: ${testClassFile.relativeTo(projectRoot)}")

        inputFile.writeText("")
        println("✅ Created: ${inputFile.relativeTo(projectRoot)}")

        testInputFile.writeText("")
        println("✅ Created: ${testInputFile.relativeTo(projectRoot)}")

        println()
        println("🎄 Day $dayNumber boilerplate generated successfully!")
        println()
        println("Next steps:")
        println("  1. Paste your puzzle input into: ${inputFile.relativeTo(projectRoot)}")
        println("  2. Paste the test input into: ${testInputFile.relativeTo(projectRoot)}")
        println("  3. Update the expected results in ${testClassFile.name}")
        println("  4. Implement part1() and part2() in ${dayClassFile.name}")
    }
}

fun main(args: Array<String>) {
    if (args.isEmpty()) {
        println("Usage: kotlin NewDayGenerator.kt <day_number>")
        println("Example: kotlin NewDayGenerator.kt 5")
        return
    }

    val dayNumber = args[0].toIntOrNull()
    if (dayNumber == null) {
        println("Error: Invalid day number '${args[0]}'")
        return
    }

    NewDayGenerator.generate(dayNumber)
}

