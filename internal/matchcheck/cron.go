package matchcheck

import (
	"git.openschubla.de/tilman/bvb-spiel-warnung-telegram-bot/internal/config"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"log"
)

func ProcessCron(bot *tgbotapi.BotAPI) {
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

	log.Println("sending to channel " + config.AppConfig.Telegram.ChannelName)
	msg := tgbotapi.NewMessageToChannel(config.AppConfig.Telegram.ChannelName, text)
	msg.ParseMode = "markdown"
	_, err := bot.Send(msg)

	if err != nil {
		log.Println("oh no :( telegram error")
		log.Println(err)
		return
	}
	log.Println("sent!")
}
