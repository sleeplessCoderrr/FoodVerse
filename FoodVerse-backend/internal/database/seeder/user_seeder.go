package seeder

import (
	"github.com/sleeplessCoderrr/FoodVerse/internal/database/model"
	"gorm.io/gorm"
)

func SeedUser(db *gorm.DB) {
	users := []model.User{
		model.User{Id: 1, Email: "test@mail.com", Password: "123456"},
		model.User{Id: 2, Email: "liman@mail.com", Password: "123456"},
	}

	for _, user := range users {
		if err := db.Create(&user).Error; err != nil {
			panic(err)
		}
	}
}