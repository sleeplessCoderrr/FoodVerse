package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sleeplessCoderrr/FoodVerse/internal/api/route"
	"github.com/sleeplessCoderrr/FoodVerse/internal/database"
	"github.com/sleeplessCoderrr/FoodVerse/internal/database/migration"
	"github.com/sleeplessCoderrr/FoodVerse/internal/database/seeder"
)

func main() {
	db := database.InitDB()
	migration.Migrate(db)
	seeder.SeedUser(db)

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
	}))
	route.InitUserRoute(r, db)
	r.Run(":8000")
}
