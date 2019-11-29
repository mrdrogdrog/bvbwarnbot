package matchcheck

import (
	"git.openschubla.de/tilman/bvbwarnbot/internal/config"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
)

func ProcessCron(bot *tgbotapi.BotAPI) {
	log.Println("[MatchCheck] Waky Waky! Time to check!")
	match := findNextMatch()
	if match == nil {
		log.Println("[MatchCheck] No Match found.")
		return
	}

	log.Println("[MatchCheck] Possible next match: " + match.Team1.TeamName + " vs " + match.Team2.TeamName + " on " + match.MatchDateTimeUTC.String())
	hour := checkForMatchWarnings(*match)
	if hour == 0 {
		log.Println("[MatchCheck] No warning needed")
		return
	}

	log.Printf("[MatchCheck] %dh warning should be sent", hour)
	text := formatText(*match, hour)

	log.Println("[Telegram] Sending to channel " + config.AppConfig.Telegram.ChannelName)
	msg := tgbotapi.NewMessageToChannel(config.AppConfig.Telegram.ChannelName, text)
	msg.ParseMode = "markdown"
	_, err := bot.Send(msg)

	if err != nil {
		log.Printf("[Telegram] Error: %s", err)
		return
	}
	log.Println("[Telegram] Message sent")
}
