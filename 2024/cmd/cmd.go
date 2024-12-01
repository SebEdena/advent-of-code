package cmd

import (
	"aoc-2024/cmd/generator"
	"aoc-2024/util/aoc"
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"strconv"

	"github.com/spf13/cobra"
)

func InitCmd() {

	var rootCmd = &cobra.Command{
		Use:   "aoc",
		Short: "Advent of Code 2024 command line",
	}

	rootCmd.AddCommand(generateDayCommand())
	rootCmd.AddCommand(runCommand())

	rootCmd.Execute()
}

func generateDayCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "generate [day]",
		Short: "Generate a new day",
		Args: func(cmd *cobra.Command, args []string) error {
			if err := cobra.ExactArgs(1)(cmd, args); err != nil {
				return err
			}
			if _, err := strconv.Atoi(args[0]); err != nil {
				return err
			}
			return nil
		},
		RunE: func(cmd *cobra.Command, args []string) error {
			day, _ := strconv.Atoi(args[0])

			err := generator.GenerateDay(day)

			if err != nil {
				return err
			}

			err = aoc.SaveInput(day)

			if err != nil {
				return err
			}

			return nil
		},
	}
}

func runCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "run [day] [part]",
		Short: "Run an Advent of Code challenge",
		Args: func(cmd *cobra.Command, args []string) error {
			if err := cobra.ExactArgs(2)(cmd, args); err != nil {
				return err
			}
			if _, err := strconv.Atoi(args[0]); err != nil {
				return err
			}
			if _, err := strconv.Atoi(args[1]); err != nil {
				return err
			}
			return nil
		},
		Run: func(cmd *cobra.Command, args []string) {
			day, _ := strconv.Atoi(args[0])
			part, _ := strconv.Atoi(args[1])

			call := exec.Command(
				"go", "run", ".", "-part", fmt.Sprintf("%d", part),
			)
			var out bytes.Buffer
			call.Stdout = &out
			call.Dir = fmt.Sprintf("./days/day%02d", day)

			err := call.Run()

			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			fmt.Println(out.String())
		},
	}
}
