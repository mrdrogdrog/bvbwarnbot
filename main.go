package main

import (
	"./config"
	"github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
	"sort"
	"time"
)

var appConfig config.AppConfig

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
