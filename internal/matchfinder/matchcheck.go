package matchfinder

import (
	"bvbwarnbot/internal/config"
	"time"
)

func CheckIfMatchWarningIsNeeded(match Match) *int {
	currentTime := now()

	for _, hour := range config.AppConfig.Warnings.Intervals {
		difference := match.MatchTime.Sub(currentTime)
		if difference <= (time.Hour*time.Duration(hour)) &&
			difference >= (time.Hour*time.Duration(hour-1)) {
			return &hour
		}
	}

	return nil
}

func now() time.Time {
	return time.Now()
}
