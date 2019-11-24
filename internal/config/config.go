package config

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
	"sort"
)

var AppConfig AppConfigYaml

func ReadConfig() {

	yamlFile, err := ioutil.ReadFile("config.yaml")
	if err != nil {
		log.Fatal(err)
	}

	var config AppConfigYaml
	err = yaml.Unmarshal(yamlFile, &config)
	if err != nil {
		log.Fatal(err)
	}

	config.Validate()
	sort.Ints(config.Warnings.Intervals)

	AppConfig = config
}
