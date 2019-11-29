package matchcheck

import (
	"git.openschubla.de/tilman/bvbwarnbot/internal/config"
	"git.openschubla.de/tilman/bvbwarnbot/internal/openligaapi"
	"time"
)

func checkForMatchWarnings(match openligaapi.Match) int {
	currentTime := now()

	for _, hour := range config.AppConfig.Warnings.Intervals {
		difference := match.MatchDateTimeUTC.Sub(currentTime)
		if difference <= (time.Hour*time.Duration(hour)) &&
			difference >= (time.Hour*time.Duration(hour-1)) {
			return hour
		}
	}

	return 0
}

func findNextMatch() *openligaapi.Match {
	currentTime := now()
	for _, match := range openligaapi.GetMatches() {

		if match.MatchDateTimeUTC.Before(currentTime) {
			continue
		}

		if match.Team1.TeamId != config.AppConfig.TeamId && match.Team2.TeamId != config.AppConfig.TeamId {
			continue
		}

		return &match
	}
	return nil
}

func now() time.Time {
	return time.Now()
}
