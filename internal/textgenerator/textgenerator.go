package textgenerator

import (
	"bvbwarnbot/internal/matchfinder"
	"log"
)

func GenerateTextForNextMatch() (*string, error) {
	log.Println("[MatchCheck] Waky Waky! Time to check!")
	match, err := matchfinder.GetNextMatchByHTML()
	if err != nil {
		return nil, err
	}
	if match == nil {
		log.Println("[MatchCheck] No Match found.")
		return nil, nil
	}

	log.Printf("[MatchCheck] Possible next match: %s vs. %s on %s", match.Team1, match.Team2, match.MatchTime.String())
	hour := matchfinder.CheckIfMatchWarningIsNeeded(*match)
	if hour == nil {
		log.Println("[MatchCheck] No warning needed")
		return nil, nil
	}

	log.Printf("[MatchCheck] %dh warning should be sent", hour)
	text := matchfinder.FormatText(*match, *hour)

	return &text, nil
}
