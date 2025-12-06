package adventofcode.utils

import java.io.File
import java.io.FileNotFoundException

class Input private constructor(
    private val content: String,
) {
    companion object {
        private const val DEFAULT_COLUMN_SEPARATOR = " "

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

    fun toRawStringList(): List<String> = this.content.trim().lines()

    fun <T> toTypedListInput(
        converter: (item: String) -> T,
        columnSep: String = DEFAULT_COLUMN_SEPARATOR
    ): List<List<T>> =
        this.content
            .trim()
            .replace(Regex(" +"), " ")
            .lines()
            .map { line ->
                line
                    .split(columnSep)
                    .filter { str -> str.isNotEmpty() }
                    .map { item -> converter(item) }
            }

    fun toStringListInput(columnSep: String = DEFAULT_COLUMN_SEPARATOR): List<List<String>> =
        toTypedListInput({ item -> item }, columnSep)

    fun toIntListInput(columnSep: String = DEFAULT_COLUMN_SEPARATOR): List<List<Int>> =
        toTypedListInput({ item -> item.toInt() }, columnSep)

    override fun toString(): String =
        this.toStringListInput().joinToString(separator = "\n") { line ->
            line.joinToString(separator = " ")
        }
}
