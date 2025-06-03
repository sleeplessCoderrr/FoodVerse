package migrations

import (
	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	UserMigrate(db)

	// Auto-migrate all models
	db.AutoMigrate(
		&model.User{},
		&model.Store{},
		&model.FoodBag{},
		&model.Order{},
	)
}
