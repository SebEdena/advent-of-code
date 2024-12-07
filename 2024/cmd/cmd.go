package cmd

import (
	"aoc-2024/cmd/generator"
	"aoc-2024/util/aoc"
	"fmt"
	"os/exec"
	"strconv"
	"strings"

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
		Use:   "generate [year] [day]",
		Short: "Generate a new day",
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
		RunE: func(cmd *cobra.Command, args []string) error {
			year, _ := strconv.Atoi(args[0])
			day, _ := strconv.Atoi(args[1])

			err := generator.GenerateDay(day)

			if err != nil {
				return err
			}

			err = aoc.SaveInput(year, day)

			if err != nil {
				return err
			}

			return nil
		},
	}
}

func runCommand() *cobra.Command {
	cmd := cobra.Command{
		Use:   "run [year] [day] [part]",
		Short: "Run an Advent of Code challenge",
		Args: func(cmd *cobra.Command, args []string) error {
			if err := cobra.ExactArgs(3)(cmd, args); err != nil {
				return err
			}
			if _, err := strconv.Atoi(args[0]); err != nil {
				return err
			}
			if _, err := strconv.Atoi(args[1]); err != nil {
				return err
			}
			if _, err := strconv.Atoi(args[2]); err != nil {
				return err
			}
			return nil
		},
		Run: func(cmd *cobra.Command, args []string) {
			year, _ := strconv.Atoi(args[0])
			day, _ := strconv.Atoi(args[1])
			part, _ := strconv.Atoi(args[2])
			submit, _ := cmd.Flags().GetBool("submit")

			call := exec.Command(
				"go", "run", ".", "-part", fmt.Sprintf("%d", part),
			)
			call.Dir = fmt.Sprintf("./days/day%02d", day)

			fmt.Printf("Running year %d - day %d - part %d\n", year, day, part)

			result, err := call.Output()

			if err != nil {
				panic(err)
			}

			answer, _ := strconv.Atoi(strings.ReplaceAll(string(result), "\n", ""))

			fmt.Printf("Answer: %d\n", answer)

			if submit {
				fmt.Printf("Sending answer %d to Advent of Code website...\n", answer)

				ok, err := aoc.SubmitResponse(year, day, part, answer)

				switch err {
				case aoc.ErrRetry:
					fmt.Fprintln(cmd.ErrOrStderr(), "You answered recently, please wait before trying again.")
				case aoc.ErrUnexpected:
					fmt.Fprintln(cmd.ErrOrStderr(), "An unexpected error occurred.")
				default:
					{
						if ok {
							fmt.Println("Great! You got it right!")
						} else {
							fmt.Println("Sorry, that's not the right answer.")
						}
					}

				}
			}
		},
	}

	cmd.Flags().Bool("submit", false, "Submit the result to Advent of Code website")

	return &cmd
}
