package textgenerator

import (
	"git.openschubla.de/tilman/bvbwarnbot/internal/matchfinder"
	"log"
)

func GenerateTextForNextMatch() *string {
	log.Println("[MatchCheck] Waky Waky! Time to check!")
	match := matchfinder.FindNextMatch()
	if match == nil {
		log.Println("[MatchCheck] No Match found.")
		return nil
	}

	log.Println("[MatchCheck] Possible next match: " + match.Team1.TeamName + " vs " + match.Team2.TeamName + " on " + match.MatchDateTimeUTC.String())
	hour := matchfinder.CheckIfMatchWarningIsNeeded(*match)
	if hour == 0 {
		log.Println("[MatchCheck] No warning needed")
		return nil
	}

	log.Printf("[MatchCheck] %dh warning should be sent", hour)
	text := matchfinder.FormatText(*match, hour)

	return &text
}
