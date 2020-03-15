package matchfinder

import (
	"errors"
	"github.com/PuerkitoBio/goquery"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
)

func GetNextMatchByHTML() (*Match, error) {
	html, err := getHTML()

	if err != nil {
		return nil, err
	}

	doc, err := goquery.NewDocumentFromReader(strings.NewReader(html))
	if err != nil {
		return nil, err
	}

	selection := doc.Find("#begin-content > div.matches-teasers.skew.bg-white > div > div.next-match.skew.bg-lightgrey.bg-light.w-2 > div > div")
	homeBox := selection.Find("a > div .home-team span").Text()
	awayBox := selection.Find("a > div .away-team span").Text()
	timeBox, _ := selection.Find("div > div.bg-icon.icon-clock > time").Attr("datetime")

	if homeBox == "" {
		return nil, errors.New("home team missing")
	}
	if awayBox == "" {
		return nil, errors.New("other team missing")
	}
	if timeBox == "" {
		return nil, errors.New("time missing")
	}

	berlin, _ := time.LoadLocation("Europe/Berlin")
	matchTime, err := time.ParseInLocation(time.RFC3339, strings.TrimSpace(timeBox), berlin)

	if err != nil {
		return nil, err
	}
	result := Match{homeBox, awayBox, matchTime}

	return &result, nil
}

func getHTML() (string, error) {
	resp, err := http.Get("https://www.bvb.de/")
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", resp.StatusCode, resp.Status)
		return "", err
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	html := string(bytes)

	return html, nil
}
