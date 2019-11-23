package main

import (
	"./openligaapi"
	"fmt"
	"github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
	"time"
)

func avoidText(heimspiel bool) (string, string) {
	if heimspiel {
		return "🏠Heimspiel", "Vermeide U42 / U46 / Kreuzviertel / Borsigplatz / Uni-Parkplatz"
	} else {
		return "🏕Auswärtsspiel", "Vermeide Kneipen mit TV"
	}
}

func main() {
	bot, err := tgbotapi.NewBotAPI("")
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = false

	log.Printf("Authorized on account %s", bot.Self.UserName)

	id := "bvbspielwarnung"

	for true {
		processCron(bot, id)
		log.Println("sleeping for 1 hour..")
		time.Sleep(time.Hour * time.Duration(1))
	}
}

func processCron(bot *tgbotapi.BotAPI, id string) {
	log.Println("Waky Waky! Time to check!")
	match := findNextMatch()
	if match == nil {
		log.Println("No Match found.")
		return
	}

	log.Println("Possible next match: " + match.Team1.TeamName + " vs " + match.Team2.TeamName + " on " + match.MatchDateTimeUTC.String())
	hour := checkForMatchWarnings(*match)
	if hour == 0 {
		log.Println("no warning needed")
		return
	}

	log.Println(string(hour) + " warning should be sent")
	text := formatText(*match, hour)

	msg := tgbotapi.NewMessageToChannel(id, text)
	msg.ParseMode = "markdown"
	log.Println("sending to channel...")
	_, err := bot.Send(msg)

	if err != nil {
		log.Println("oh no :( telegram error")
		log.Println(err)
		return
	}
	log.Println("sent!")
}

func findNextMatch() *openligaapi.Match {
	currentTime := now()
	log.Println("the time is: " + currentTime.String())
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
	return time.Now().Add(time.Duration(-24) * time.Hour)
}

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

func checkForMatchWarnings(match openligaapi.Match) int {
	log.Println(match)
	currentTime := now()
	log.Println(currentTime)
	hours := []int{1, 3, 6, 12, 24, 48}

	for _, hour := range hours {
		hourShiftStart := currentTime.Add(time.Hour * time.Duration(hour-1))
		hourShiftEnd := currentTime.Add(time.Hour * time.Duration(hour))

		if match.MatchDateTimeUTC.After(hourShiftStart) && match.MatchDateTimeUTC.Before(hourShiftEnd) {
			return hour
		}
	}

	return 0
}
