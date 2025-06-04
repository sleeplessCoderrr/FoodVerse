package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost             string
	DBPort             string
	DBUser             string
	DBPassword         string
	DBName             string
	ServerPort         string
	JWTSecret          string
	JWTExpirationHours int
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func LoadConfig() (*Config, error) {
	_ = godotenv.Load()
	jwtHours, err := strconv.Atoi(getEnv("JWT_EXPIRATION_HOURS", "24"))
	if err != nil {
		jwtHours = 24
	}

	config := &Config{
		DBHost:             getEnv("DB_HOST", "localhost"),
		DBPort:             getEnv("DB_PORT", "5432"),
		DBUser:             getEnv("DB_USER", "foodverse"),
		DBPassword:         getEnv("DB_PASSWORD", "foodverse"),
		DBName:             getEnv("DB_NAME", "foodverse"),
		ServerPort:         getEnv("SERVER_PORT", "7000"),
		JWTSecret:          getEnv("JWT_SECRET", "your_jwt_secret"),
		JWTExpirationHours: jwtHours,
	}

	fmt.Println(config.ServerPort)

	return config, nil
}
