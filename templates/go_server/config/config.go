package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port int
	Host string
}

func Load() *Config {
	portStr := os.Getenv("PORT")
	port := 8081
	if portStr != "" {
		if val, err := strconv.Atoi(portStr); err == nil {
			port = val
		}
	}

	host := os.Getenv("HOST")
	if host == "" {
		host = "0.0.0.0"
	}

	return &Config{
		Port: port,
		Host: host,
	}
}
