package generator

import (
	"fmt"
	"os"
	"text/template"
)

func GenerateDay(day int) error {
	folder := fmt.Sprintf("./days/day%02d", day)

	os.Mkdir(folder, 0777)

	challengeTemplate, err := template.ParseFiles("./cmd/generator/templates/challenge.tmpl")

	if err != nil {
		return err
	}

	challengeFile, _ := os.Create(fmt.Sprintf("%s/challenge.go", folder))
	defer challengeFile.Close()
	challengeTemplate.Execute(challengeFile, map[string]int{
		"Day": day,
	})

	return nil
}
