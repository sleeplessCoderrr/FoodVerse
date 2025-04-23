package main

import (
	"github.com/gin-gonic/gin"
	"github.com/sleeplessCoderrr/FoodVerse/internal/config"
	"github.com/sleeplessCoderrr/FoodVerse/internal/controller"
	"github.com/sleeplessCoderrr/FoodVerse/internal/middleware"
	"github.com/sleeplessCoderrr/FoodVerse/internal/model"
	"github.com/sleeplessCoderrr/FoodVerse/internal/repository"
	"github.com/sleeplessCoderrr/FoodVerse/internal/service"
	"github.com/sleeplessCoderrr/FoodVerse/pkg/database"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		panic("failed to load config: " + err.Error())
	}

	db, err := database.NewConnection(cfg)
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}

	err = db.AutoMigrate(&model.User{})
	if err != nil {
		panic("failed to migrate database: " + err.Error())
	}

	userRepo := repository.NewUserRepository(db)
	
	jwtService := service.NewJWTService(cfg.JWTSecret, cfg.JWTExpirationHours)
	authService := service.NewAuthService(userRepo, jwtService)

	authController := controller.NewAuthController(authService)

	router := gin.Default()
	
	public := router.Group("/api/v1")
	{
		public.POST("/register", authController.Register)
		public.POST("/login", authController.Login)
	}

	protected := router.Group("/api/v1")
	protected.Use(middleware.JWTAuthMiddleware(jwtService))
	{
		protected.GET("/user", authController.Profile)
	}

	if err := router.Run(cfg.ServerPort); err != nil {
		panic("failed to start server: " + err.Error())
	}

}
