package matchfinder

import (
	"fmt"
	"git.openschubla.de/tilman/bvbwarnbot/internal/config"
	"time"
)

func FormatText(match Match, hour int) string {
	format :=
		"⚠️*%dh-Warnung!*⚠️\n" +
			"\n" +
			"%s, %s\n" +
			"%s vs %s\n" +
			"\n" +
			"*%s*\n" +
			"%s\n"

	heimSpiel := match.Team1 == "Borussia Dortmund"
	matchType, avoidText := avoidText(heimSpiel)

	text := fmt.Sprintf(format,
		hour,
		weekdaystring(match),
		match.MatchTime.Format("02.01.2006 - 15:04"),
		match.Team1, match.Team2,
		matchType,
		avoidText)

	return text
}

func weekdaystring(match Match) string {
	var w string
	y1, m1, d1 := match.MatchTime.Date()
	y2, m2, d2 := now().Date()
	if y1 == y2 && m1 == m2 && d1 == d2 {
		w = "Heute"
	} else {
		w = wochentag(match.MatchTime.Weekday())
	}
	return w
}

func wochentag(dow time.Weekday) string {
	var dows = [...]string{
		"Sonntag",
		"Montag",
		"Dienstag",
		"Mittwoch",
		"Donnerstag",
		"Freitag",
		"Samstag",
	}

	return dows[dow]
}

func avoidText(heimspiel bool) (string, string) {
	if heimspiel {
		return config.AppConfig.Warnings.HomeTitle, config.AppConfig.Warnings.HomeMessage
	} else {
		return config.AppConfig.Warnings.GuestTitle, config.AppConfig.Warnings.GuestMessage
	}
}
