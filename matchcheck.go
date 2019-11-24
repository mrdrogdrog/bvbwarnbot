package main

import (
	"./openligaapi"
	"log"
	"time"
)

func checkForMatchWarnings(match openligaapi.Match) int {
	currentTime := now()

	for _, hour := range appConfig.Warnings.Intervals {
		difference := match.MatchDateTimeUTC.Sub(currentTime)
		if difference < (time.Hour * time.Duration(hour)) {
			return hour
		}
	}

	return 0
}

func findNextMatch() *openligaapi.Match {
	currentTime := now()
	log.Println("Time time is: " + currentTime.String())
	for _, match := range openligaapi.GetMatches() {

		if match.MatchDateTimeUTC.Before(currentTime) {
			continue
		}

		if match.Team1.TeamId != 7 && match.Team2.TeamId != 7 {
			continue
		}

		return &match
	}
	return nil
}

func now() time.Time {
	return time.Now().Add(time.Duration(-25) * time.Hour)
}