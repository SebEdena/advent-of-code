package cmd

import (
	"strconv"

	"github.com/spf13/cobra"
)

func GetCmd() {

	var rootCmd = &cobra.Command{
		Use:   "aoc",
		Short: "Advent of Code 2024 command line",
	}

	rootCmd.AddCommand(generateDay())
}

func generateDay() *cobra.Command {
	var cmd = &cobra.Command{
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
	}

	return cmd
}
