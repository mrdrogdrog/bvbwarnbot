package openligaapi

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

func GetMatches() []Match {
	currentTime := time.Now()

	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("https://www.openligadb.de/api/getmatchdata/bl1/%d", currentTime.Year()), nil)

	if err != nil {
		log.Println(err)
		return nil
	}

	req.Header.Set("User-Agent", "bvbwarnbot")
	req.Header.Add("Accept", "application/json")
	res, err := client.Do(req)

	if err != nil {
		log.Println(err)
		return nil
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Println(readErr)
		return nil
	}

	var matches []Match
	jsonErr := json.Unmarshal(body, &matches)
	if jsonErr != nil {
		log.Println(jsonErr)
		return nil
	}

	return matches
}
