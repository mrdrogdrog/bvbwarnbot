package config

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"log"
)

func ReadConfig() *AppConfig {

	yamlFile, err := ioutil.ReadFile("config.yaml")
	if err != nil {
		log.Fatal(err)
	}

	var config AppConfig
	err = yaml.Unmarshal(yamlFile, &config)
	if err != nil {
		log.Fatal(err)
	}

	return &config
}
