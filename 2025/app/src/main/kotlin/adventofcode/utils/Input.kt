package adventofcode.utils

import java.io.File
import java.io.FileNotFoundException

class Input private constructor(
    private val content: String,
) {
    companion object {
        fun fromFile(path: String): Input {
            // Try to load from file system first
            val file = File(path)
            if (file.exists()) {
                val text = file.inputStream().bufferedReader().use { it.readText() }
                return Input(text)
            }

            // Try to load from classpath resources
            val normalizedPath = path.removePrefix("./").removePrefix("/")
            val stream =
                Input::class.java.classLoader.getResourceAsStream(normalizedPath)
                    ?: Input::class.java.getResourceAsStream("/$normalizedPath")
                    ?: throw FileNotFoundException("File not found: $path (tried filesystem and classpath)")

            val text = stream.bufferedReader().use { it.readText() }
            return Input(text)
        }
    }

    fun <T> toTypedInput(converter: (item: String) -> T): List<List<T>> =
        this.content
            .trim()
            .replace(Regex(" +"), " ")
            .lines()
            .map { line ->
                line.split(" ").map { item -> converter(item) }
            }

    fun toStringInput(): List<List<String>> = toTypedInput { item -> item }

    fun toIntInput(): List<List<Int>> = toTypedInput { item -> item.toInt() }

    override fun toString(): String =
        this.toStringInput().joinToString(separator = "\n") { line ->
            line.joinToString(separator = " ")
        }
}
