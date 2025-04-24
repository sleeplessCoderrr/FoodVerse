package migrations

import (
	"github.com/sleeplessCoderrr/FoodVerse/internal/model"
	"gorm.io/gorm"
)

func UserMigrate(db *gorm.DB) {
	db.Migrator().DropTable(&model.User{})
	db.AutoMigrate(&model.User{})
}
