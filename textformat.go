package main

import (
	"./openligaapi"
	"fmt"
)

func formatText(match openligaapi.Match, hour int) string {
	format :=
		"⚠️*%dh-Warnung!*⚠️\n" +
			"\n" +
			"%s\n" +
			"%s vs %s\n" +
			"\n" +
			"*%s*\n" +
			"%s\n"

	heimSpiel := match.Team1.TeamId == 7
	matchType, avoidText := avoidText(heimSpiel)

	text := fmt.Sprintf(format,
		hour,
		match.MatchDateTimeUTC.Format("Mon, 02.01.2006 - 15:04"),
		match.Team1.TeamName, match.Team2.TeamName,
		matchType,
		avoidText)

	return text
}

func avoidText(heimspiel bool) (string, string) {
	if heimspiel {
		return appConfig.Warnings.HomeTitle, appConfig.Warnings.HomeMessage
	} else {
		return appConfig.Warnings.GuestTitle, appConfig.Warnings.GuestMessage
	}
}
