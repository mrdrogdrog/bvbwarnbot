package main

import (
	"git.openschubla.de/tilman/bvb-spiel-warnung-telegram-bot/internal/config"
	"git.openschubla.de/tilman/bvb-spiel-warnung-telegram-bot/internal/matchcheck"
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

	log.Printf("[Telegram] Authorized on account %s", bot.Self.UserName)
	log.Printf("[Telegram] The target is %s", config.AppConfig.Telegram.ChannelName)

	for true {
		matchcheck.ProcessCron(bot)
		log.Printf("[Main] Sleep for %d hour", config.AppConfig.FetchInterval)
		time.Sleep(time.Hour * time.Duration(config.AppConfig.FetchInterval))
	}
}
