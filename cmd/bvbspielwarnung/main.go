package main

import (
	"git.openschubla.de/tilman/bvb-warn-telegram-bot/internal/config"
	"git.openschubla.de/tilman/bvb-warn-telegram-bot/internal/matchcheck"
	"github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
	"time"
)

func main() {
	config.ReadConfig()

	bot, err := tgbotapi.NewBotAPI(config.AppConfig.Telegram.ApiKey)
	if err != nil {
		log.Panic(err)
	}

	bot.Debug = false

	log.Printf("Authorized on account %s", bot.Self.UserName)

	for true {
		matchcheck.ProcessCron(bot)
		log.Printf("Sleep for %d hour", config.AppConfig.FetchInterval)
		time.Sleep(time.Hour * time.Duration(config.AppConfig.FetchInterval))
	}
}
