package aoc

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	urls "net/url"
	"os"
	"strconv"
	"strings"
)

var ErrFutureDay = fmt.Errorf("future_day")
var ErrRetry = fmt.Errorf("retry_later")
var ErrUnexpected = fmt.Errorf("unexpected_error")

func SaveInput(year, day int) error {

	url := fmt.Sprintf("https://adventofcode.com/%d/day/%d/input", year, day)

	req, err := aocRequest("GET", url, nil)

	if err != nil {
		return err
	}

	inputBytes, err := aocQuery(req)

	if err != nil {
		return err
	}

	if strings.Contains(string(*inputBytes),
		"Please don't repeatedly request this endpoint before it unlocks!") {
		return ErrFutureDay
	}

	err = os.WriteFile(fmt.Sprintf("./days/day%02d/input.txt", day), *inputBytes, 0777)

	if err != nil {
		return err
	}

	return nil
}

func SubmitResponse(year, day, part int, answer string) (bool, error) {

	url := fmt.Sprintf("https://adventofcode.com/%d/day/%d/answer", year, day)

	params := urls.Values{}
	params.Add("level", strconv.Itoa(part))
	params.Add("answer", answer)

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
		return false, ErrRetry
	}

	return false, ErrUnexpected
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
