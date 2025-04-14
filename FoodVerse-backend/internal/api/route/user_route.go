package route

import (
	"github.com/gin-gonic/gin"
	"github.com/sleeplessCoderrr/FoodVerse/internal/api/handler"
	"gorm.io/gorm"
)

func InitUserRoute(r *gin.Engine, db *gorm.DB) {
	userHandler := handler.NewUserHandler(db)

	r.POST("/login", userHandler.Login)
}