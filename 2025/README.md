# Advent of Code 2025 - Kotlin

Advent of Code 2025 solutions implemented in Kotlin.

Designed for seamless development across **Windows Subsystem for Linux (WSL2)** and **macOS**.

This project uses the **Gradle Version Catalog** for dependency management and **SDKMAN\!** for deterministic toolchain
provisioning.

## 🚀 Prerequisites

To ensure reproducible builds across different machines, this project relies on([https://sdkman.io](https://sdkman.io)).

### Supported Environments

* **Windows:** Must use WSL2 (Ubuntu 22.04+ recommended).
* **macOS:** Native Terminal (Zsh).
* **Linux:** Native Terminal (Bash/Zsh).

### 1\. Install SDKMAN\!

If you haven't already, install SDKMAN\! in your terminal (WSL or macOS):

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
````

### 2. Provision the Toolchain

Instead of manually installing Java, let SDKMAN configure the exact version required by this project. Run the following
command in the project root:

```bash
sdk env install
````

*This looks for the `.sdkmanrc` file (if present) or you can manually install the standard:*

```bash
sdk install java 21.0.9-oracle
```

## 🛠️ Building and Running

This project uses the **Gradle Wrapper**, ensuring you don't need to install Gradle globally.

### Run the Application

```bash
./gradlew run
```

### Run Tests

```bash
./gradlew test
```

### Generate a new day

```bash
./gradlew generateDay -Pday=<dayNumber>
```

## 📦 Dependency Management (Version Catalog)

Dependencies are centralized in `gradle/libs.versions.toml`. This allows us to share versions across modules and
prevents conflict errors.

### Adding a New Library

1. Open `gradle/libs.versions.toml`.
2. Add the version under `[versions]` and the library alias under `[libraries]`.

**Example `gradle/libs.versions.toml`:**

```toml
[versions]
coroutines = "1.10.1"

[libraries]
kotlinx-coroutines-core = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-core", version.ref = "coroutines" }
```

3. Reference it in your `build.gradle.kts` using the **type-safe accessor**:
    * *Note: Dashes in TOML become dots in Kotlin.*
    * *Note: You must use the `libs` prefix.*

**Example `app/build.gradle.kts`:**

```kotlin
dependencies {
    // CORRECT: Uses the generated accessor
    implementation(libs.kotlinx.coroutines.core)

    // INCORRECT: Will cause "Unresolved reference"
    // implementation(kotlinx.coroutines.core) 
}
```

## 🔧 Cross-Platform Compatibility Notes

### Line Endings (CRLF vs LF)

This project includes a `.gitattributes` file to enforce `LF` (Linux-style) line endings for shell scripts (`gradlew`),
even if cloned on Windows.

* **Windows Users:** Do **not** clone this project into a standard Windows folder (e.g., `C:\Users\...`). Clone it into
  your WSL filesystem (e.g., `\\wsl$\Ubuntu\home\username\...`) for maximum performance and compatibility.

### File Permissions

If you encounter a `Permission denied` error when trying to run `./gradlew` on macOS or Linux, the executable bit might
have been lost during a file transfer. Fix it with:

```bash
chmod +x gradlew
```

## 📂 Project Structure

```
├── app/
│   ├── build.gradle.kts      \# Module-specific build config
│   └── src/                  \# Source code (standard Maven layout)
├── gradle/
│   ├── wrapper/              \# Gradle Wrapper jar and properties
│   └── libs.versions.toml    \# Central Version Catalog
├── build.gradle.kts          \# Root project configuration
├── settings.gradle.kts       \# Project definition and module inclusion
├── gradlew                   \# Build script (Unix/WSL/macOS)
└── gradlew.bat               \# Build script (Windows CMD - avoid using if possible)
```

## ❓ Troubleshooting

**Q: I get "Unresolved reference: libs" in IntelliJ.**
A: After modifying `libs.versions.toml`, you must sync the project. Click the **Load Gradle Changes** icon (elephant
with sync arrows) in the top-right of IntelliJ.

**Q: `java_home` is not found.**
A: Ensure you have initialized SDKMAN\! via `source "$HOME/.sdkman/bin/sdkman-init.sh"` and run
`sdk use java 21.0.9-oracle`.
