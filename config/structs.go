package config

type AppConfig struct {
	Telegram      TelegramConfig `yaml:"telegram"`
	Warnings      WarningConfig  `yaml:"warnings"`
	FetchInterval int            `yaml:"fetch_interval"`
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
