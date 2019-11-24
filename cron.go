package main

import (
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
)

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
		log.Println("No warning needed")
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
