package main

import (
	"git.openschubla.de/tilman/bvbwarnbot/internal/config"
	"git.openschubla.de/tilman/bvbwarnbot/internal/textgenerator"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
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
	log.Printf("[Telegram] The main target is %s", config.AppConfig.Telegram.ChannelName)
	log.Printf("[Telegram] The maintainer target is %s", config.AppConfig.Telegram.ErrorName)
	log.Println("[Telegram] Informing the maintainer about the start up")
	sendTelegram("Bot is up", config.AppConfig.Telegram.ErrorName, bot)

	for true {
		text, err := textgenerator.GenerateTextForNextMatch()

		if err != nil {
			log.Println(err)
			log.Printf("[Telegram] Sending error to %s", config.AppConfig.Telegram.ErrorName)
			sendTelegram(*text, config.AppConfig.Telegram.ErrorName, bot)
		}

		if text != nil {
			log.Printf("[Telegram] Sending to channel %s", config.AppConfig.Telegram.ChannelName)
			sendTelegram(*text, config.AppConfig.Telegram.ChannelName, bot)
		}

		log.Printf("[Main] Sleep for %d hour", config.AppConfig.FetchInterval)
		time.Sleep(time.Hour * time.Duration(config.AppConfig.FetchInterval))
	}
}

func sendTelegram(message string, receiver string, bot *tgbotapi.BotAPI) {
	msg := tgbotapi.NewMessageToChannel(receiver, message)
	msg.ParseMode = "markdown"
	_, err := bot.Send(msg)

	if err != nil {
		log.Printf("[Telegram] Error: %s", err)
	} else {
		log.Println("[Telegram] Message sent")
	}
}
