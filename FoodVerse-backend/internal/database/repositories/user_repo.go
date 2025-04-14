package repositories

import (
	"github.com/sleeplessCoderrr/FoodVerse/internal/database/model"
	"gorm.io/gorm"
)

func CheckAuthentication(db *gorm.DB, email string, password string) bool {
	result := db.Where(
		&model.User{
			Email:    email,
			Password: password,
		},
	).First(&model.User{})
	return result.Error == nil
}
