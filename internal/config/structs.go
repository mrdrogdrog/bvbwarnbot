package config

import "log"

type AppConfigYaml struct {
	Telegram      TelegramConfig `yaml:"telegram"`
	Warnings      WarningConfig  `yaml:"warnings"`
	FetchInterval int            `yaml:"fetch_interval"`
}

func (config AppConfigYaml) Validate() {
	if config.FetchInterval < 0 {
		log.Fatal("[Config] Fetch interval isn't set to a positive integer")
	}
	if config.Telegram.ApiKey == "" {
		log.Fatal("[Config] Telegram bot api key isn't set")
	}
	if config.Telegram.ChannelName == "" {
		log.Fatal("[Config] Telegram channel name isnt't set")
	}
	if config.Telegram.ErrorName == "" {
		log.Fatal("[Config] Telegram maintainer channel name isnt't set")
	}
	if config.Warnings.Intervals == nil || len(config.Warnings.Intervals) == 0 {
		log.Fatal("[Config] No warning intervals aren't set")
	}
	for _, interval := range config.Warnings.Intervals {
		if interval < 0 {
			log.Fatal("[Config] A warning interval isn't set to a positive integer")
		}
	}
	if config.Warnings.GuestTitle == "" {
		log.Fatal("[Config] Guest title isn't set")
	}
	if config.Warnings.GuestMessage == "" {
		log.Fatal("[Config] Guest message isn't set")
	}
	if config.Warnings.HomeTitle == "" {
		log.Fatal("[Config] Guest title isn't set")
	}
	if config.Warnings.HomeMessage == "" {
		log.Fatal("[Config] Guest message isn't set")
	}
}

type TelegramConfig struct {
	ApiKey      string `yaml:"api_key"`
	ChannelName string `yaml:"channel_name"`
	MaintainerName   string `yaml:"maintainer_name"`
}

type WarningConfig struct {
	Intervals    []int  `yaml:"intervals"`
	HomeTitle    string `yaml:"home_title"`
	GuestTitle   string `yaml:"guest_title"`
	HomeMessage  string `yaml:"home_message"`
	GuestMessage string `yaml:"guest_message"`
}
