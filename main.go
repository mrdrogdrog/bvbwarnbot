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
	bot, err := tgbotapi.NewBotAPI("945610724:AAGVtdQK_YO_Mybtml5trnyKQb_erKdfFoA")
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = false

	log.Printf("Authorized on account %s", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message == nil { // ignore any non-Message Updates
			continue
		}

		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)

		for _, match := range openligaapi.GetMatches() {
			hour := checkForMatchWarnings(match)
			if hour == 0 {
				continue
			}

			text := formatText(match, hour)
			chatId := update.Message.Chat.ID

			msg := tgbotapi.NewMessage(chatId, text)
			msg.ParseMode = "markdown"
			_, err = bot.Send(msg)

			if err != nil {
				log.Panic(err)
			}

			break
		}
	}
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
		match.MatchDateTimeUTC.Format("02.01.2006 - 15:04"),
		match.Team1.TeamName, match.Team2.TeamName,
		matchType,
		avoidText)

	return text
}

func checkForMatchWarnings(match openligaapi.Match) int {
	currentTime := time.Now()

	if match.MatchDateTimeUTC.Before(currentTime) {
		return 0
	}

	if match.Team1.TeamId != 7 && match.Team2.TeamId != 7 {
		return 0
	}

	hours := []int{1, 3, 6, 12, 24, 48}

	for _, hour := range hours {
		hourShift := currentTime.Add(time.Hour * time.Duration(hour))
		if match.MatchDateTimeUTC.After(hourShift) {
			continue
		}

		return hour
	}

	return 0
}
