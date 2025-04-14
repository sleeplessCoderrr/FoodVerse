package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/sleeplessCoderrr/FoodVerse/internal/database/repositories"
	"gorm.io/gorm"
)

type UserHandler struct {
	Db *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{Db: db}
}

func (h *UserHandler) Login(c *gin.Context) {
	email := c.PostForm("email")
	password := c.PostForm("password")
	result := repositories.CheckAuthentication(
		h.Db,
		email,
		password,
	)

	if result {
		c.JSON(200, gin.H{
			"message": "Login successful",
		})
	} else {
		c.JSON(401, gin.H{
			"message": "Invalid credentials",
		})
	}
}
