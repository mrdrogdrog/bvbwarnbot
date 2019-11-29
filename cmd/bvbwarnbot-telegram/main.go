package main

import (
	"git.openschubla.de/tilman/bvbwarnbot/internal/config"
	"git.openschubla.de/tilman/bvbwarnbot/internal/matchcheck"
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

	log.Printf("[Telegram] Authorized on account %s", bot.Self.UserName)
	log.Printf("[Telegram] The target is %s", config.AppConfig.Telegram.ChannelName)

	for true {
		matchcheck.ProcessCron(bot)
		log.Printf("[Main] Sleep for %d hour", config.AppConfig.FetchInterval)
		time.Sleep(time.Hour * time.Duration(config.AppConfig.FetchInterval))
	}
}
