package main

import (
	"./config"
	"./openligaapi"
	"fmt"
	"github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
	"sort"
	"time"
)

var appConfig config.AppConfig

func avoidText(heimspiel bool) (string, string) {
	if heimspiel {
		return appConfig.Warnings.HomeTitle, appConfig.Warnings.HomeMessage
	} else {
		return appConfig.Warnings.GuestTitle, appConfig.Warnings.GuestMessage
	}
}

func main() {
	appConfig = *config.ReadConfig()

	appConfig.Validate()
	sort.Ints(appConfig.Warnings.Intervals)

	bot, err := tgbotapi.NewBotAPI(appConfig.Telegram.ApiKey)
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = false

	log.Printf("Authorized on account %s", bot.Self.UserName)

	for true {
		processCron(bot)
		log.Printf("Sleep for %d hour", appConfig.FetchInterval)
		time.Sleep(time.Hour * time.Duration(appConfig.FetchInterval))
	}
}

func processCron(bot *tgbotapi.BotAPI) {
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

	log.Printf("%dh warning should be sent", hour)
	text := formatText(*match, hour)

	log.Println("sending to channel " + appConfig.Telegram.ChannelName)
	msg := tgbotapi.NewMessageToChannel(appConfig.Telegram.ChannelName, text)
	msg.ParseMode = "markdown"
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
	return time.Now().Add(time.Duration(-25) * time.Hour)
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

	for _, hour := range appConfig.Warnings.Intervals {
		hourShiftStart := currentTime.Add(time.Hour * time.Duration(hour-1))
		hourShiftEnd := currentTime.Add(time.Hour * time.Duration(hour))

		if match.MatchDateTimeUTC.After(hourShiftStart) && match.MatchDateTimeUTC.Before(hourShiftEnd) {
			return hour
		}
	}

	return 0
}
