package main

import (
	"git.openschubla.de/tilman/bvbwarnbot/internal/config"
	"git.openschubla.de/tilman/bvbwarnbot/pkgs/textgenerator"
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
		text := textgenerator.GenerateTextForNextMatch()

		if text != nil {
			log.Println("[Telegram] Sending to channel " + config.AppConfig.Telegram.ChannelName)
			msg := tgbotapi.NewMessageToChannel(config.AppConfig.Telegram.ChannelName, *text)
			msg.ParseMode = "markdown"
			_, err := bot.Send(msg)

			if err != nil {
				log.Printf("[Telegram] Error: %s", err)
				return
			}
			log.Println("[Telegram] Message sent")
		}

		log.Printf("[Main] Sleep for %d hour", config.AppConfig.FetchInterval)
		time.Sleep(time.Hour * time.Duration(config.AppConfig.FetchInterval))
	}
}
