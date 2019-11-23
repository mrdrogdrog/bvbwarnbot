package openligaapi

import "time"

type Team struct {
	ShortName   string
	TeamName    string
	TeamId      int
	TeamIconUrl string
}

type Match struct {
	Team1            Team
	Team2            Team
	MatchDateTimeUTC time.Time
}
