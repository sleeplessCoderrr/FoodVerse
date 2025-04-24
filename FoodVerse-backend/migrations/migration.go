package migrations

import "gorm.io/gorm"

func Migrate(db *gorm.DB) {
	UserMigrate(db)
}
