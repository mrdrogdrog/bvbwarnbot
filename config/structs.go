package config

import "log"

type AppConfig struct {
	Telegram      TelegramConfig `yaml:"telegram"`
	Warnings      WarningConfig  `yaml:"warnings"`
	FetchInterval int            `yaml:"fetch_interval"`
}

func (config AppConfig) Validate() {
	if config.FetchInterval < 0 {
		log.Fatal("Fetch interval wasn't set to a positive integer")
	}
	if config.Telegram.ApiKey == "" {
		log.Fatal("Telegram bot api key wasn't set")
	}
	if config.Telegram.ChannelName == "" {
		log.Fatal("Telegram channel name wasn't set")
	}
	if config.Warnings.Intervals == nil || len(config.Warnings.Intervals) == 0 {
		log.Fatal("No warning intervals were set")
	}
	for _, interval := range config.Warnings.Intervals {
		if interval <= 0 {
			log.Fatal("A warning interval wasn't set to a positive integer")
		}
	}
	if config.Warnings.GuestTitle == "" {
		log.Fatal("Guest title was not set")
	}
	if config.Warnings.GuestMessage == "" {
		log.Fatal("Guest message was not set")
	}
	if config.Warnings.HomeTitle == "" {
		log.Fatal("Guest title was not set")
	}
	if config.Warnings.HomeMessage == "" {
		log.Fatal("Guest message was not set")
	}
}

type TelegramConfig struct {
	ApiKey      string `yaml:"api_key"`
	ChannelName string `yaml:"channel_name"`
}

type WarningConfig struct {
	Intervals    []int  `yaml:"intervals"`
	HomeTitle    string `yaml:"home_title"`
	GuestTitle   string `yaml:"guest_title"`
	HomeMessage  string `yaml:"home_message"`
	GuestMessage string `yaml:"guest_message"`
}
