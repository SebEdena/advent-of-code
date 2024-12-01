package main

import (
	"aoc-2024/cmd"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	cmd.InitCmd()
}
