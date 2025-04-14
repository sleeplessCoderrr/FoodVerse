package migration

import (
	"github.com/sleeplessCoderrr/FoodVerse/internal/database/model"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.Migrator().DropTable(&model.User{})
	db.AutoMigrate(&model.User{})
}
