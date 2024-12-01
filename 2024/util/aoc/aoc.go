package aoc

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	urls "net/url"
	"os"
	"strconv"
	"strings"
)

func SaveInput(day int) error {

	url := fmt.Sprintf("https://adventofcode.com/2024/day/%d/input", day)

	req, err := aocRequest("GET", url, nil)

	if err != nil {
		return err
	}

	inputBytes, err := aocQuery(req)

	if err != nil {
		return err
	}

	os.WriteFile(fmt.Sprintf("./days/day%02d/input.txt", day), *inputBytes, 0777)

	return nil
}

func SubmitResponse(day, part, answer int) (bool, error) {

	url := fmt.Sprintf("https://adventofcode.com/2024/day/%d/answer", day)

	params := urls.Values{}
	params.Add("level", strconv.Itoa(part))
	params.Add("answer", strconv.Itoa(answer))

	req, err := aocRequest("POST", url, bytes.NewBufferString(params.Encode()))

	if err != nil {
		return false, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	bytes, err := aocQuery(req)

	if err != nil {
		return false, err
	}

	html := string(*bytes)

	if strings.Contains(html, "That's the right answer") {
		return true, nil
	}

	if strings.Contains(html, "That's not the right answer") {
		return false, nil
	}

	if strings.Contains(html, "You gave an answer too recently") {
		return false, errors.New("you gave an answer too recently")
	}

	return false, errors.New("unexpected error")
}

func aocRequest(method, path string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(method, path, body)
	if err != nil {
		return nil, err
	}
	sessionCookie := http.Cookie{
		Name:  "session",
		Value: os.Getenv("SESSION_COOKIE"),
	}
	req.AddCookie(&sessionCookie)
	return req, nil
}

func aocQuery(request *http.Request) (*[]byte, error) {

	resp, err := http.DefaultClient.Do(request)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	resBody, err := io.ReadAll(resp.Body)

	if err != nil {
		return nil, err
	}

	return &resBody, nil
}
