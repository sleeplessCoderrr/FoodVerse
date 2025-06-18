package main

import (
	_ "github.com/FoodVerse/FoodVerse-backend/docs"
	"github.com/FoodVerse/FoodVerse-backend/internal/config"
	"github.com/FoodVerse/FoodVerse-backend/internal/controller"
	"github.com/FoodVerse/FoodVerse-backend/internal/middleware"
	"github.com/FoodVerse/FoodVerse-backend/internal/repository"
	"github.com/FoodVerse/FoodVerse-backend/internal/service"
	"github.com/FoodVerse/FoodVerse-backend/migrations"
	"github.com/FoodVerse/FoodVerse-backend/pkg/database"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title FoodVerse API
// @version 1.0
// @description API for FoodVerse food waste reduction platform
// @termsOfService http://swagger.io/terms/

// @contact.name FoodVerse Support
// @contact.url http://www.foodverse.com/support
// @contact.email support@foodverse.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:7000
// @BasePath /api/v1

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		panic("failed to load config: " + err.Error())
	}

	db, err := database.NewConnection(cfg)
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}
	// Run migrations
	migrations.Migrate(db)

	// Seed database with initial data (only in development)
	// seedDatabase(db)

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	storeRepo := repository.NewStoreRepository(db)
	foodBagRepo := repository.NewFoodBagRepository(db)
	orderRepo := repository.NewOrderRepository(db)
	sellerRequestRepo := repository.NewSellerRequestRepository(db)

	// Initialize services
	jwtService := service.NewJWTService(cfg.JWTSecret, cfg.JWTExpirationHours)
	authService := service.NewAuthService(userRepo, jwtService)

	// Initialize controllers
	authController := controller.NewAuthController(authService)
	storeController := controller.NewStoreController(storeRepo)
	foodBagController := controller.NewFoodBagController(foodBagRepo, storeRepo)
	orderController := controller.NewOrderController(orderRepo, foodBagRepo)
	sellerRequestController := controller.NewSellerRequestController(sellerRequestRepo, userRepo)

	// App Router
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Swagger documentation
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Debug route to check if routing works
	router.GET("/swagger", func(c *gin.Context) {
		c.Redirect(302, "/swagger/index.html")
	})

	// Public routes
	public := router.Group("/api/v1")
	{
		// Auth routes
		public.POST("/register", authController.Register)
		public.POST("/login", authController.Login)

		// Search routes (public for browsing)
		public.POST("/stores/search", storeController.SearchStores)
		public.POST("/food-bags/search", foodBagController.SearchFoodBags)
		public.GET("/stores/:id", storeController.GetStore)
		public.GET("/food-bags/:id", foodBagController.GetFoodBag)

		// Store specific food bags (using different path structure)
		public.GET("/store-food-bags/:store_id", foodBagController.GetFoodBagsByStore)
	}

	// Protected routes
	protected := router.Group("/api/v1")
	protected.Use(middleware.JWTAuthMiddleware(jwtService))
	{
		// User routes
		protected.GET("/user", authController.Profile)
		protected.GET("/user/stats", authController.UserStats)

		// Seller request routes
		protected.POST("/seller-requests", sellerRequestController.CreateSellerRequest)
		protected.GET("/seller-requests/my", sellerRequestController.GetMySellerRequest)
		protected.GET("/seller-requests", sellerRequestController.GetSellerRequests)       // Admin only
		protected.PUT("/seller-requests/:id", sellerRequestController.UpdateSellerRequest) // Admin only

		// Store management routes
		protected.POST("/stores", storeController.CreateStore)
		protected.GET("/stores/my", storeController.GetMyStores)
		protected.PUT("/stores/:id", storeController.UpdateStore)
		protected.DELETE("/stores/:id", storeController.DeleteStore)

		// Food bag management routes
		protected.POST("/food-bags", foodBagController.CreateFoodBag)
		protected.PUT("/food-bags/:id", foodBagController.UpdateFoodBag)
		protected.DELETE("/food-bags/:id", foodBagController.DeleteFoodBag)

		// Order routes
		protected.POST("/orders", orderController.CreateOrder)
		protected.GET("/orders/:id", orderController.GetOrder)
		protected.GET("/orders/my", orderController.GetMyOrders)
		protected.PUT("/orders/:id/status", orderController.UpdateOrderStatus)
		protected.POST("/orders/verify-pickup", orderController.VerifyPickupCode)
	}

	// Protected store specific routes
	protectedStoreRoutes := router.Group("/api/v1")
	protectedStoreRoutes.Use(middleware.JWTAuthMiddleware(jwtService))
	{
		protectedStoreRoutes.GET("/store/:store_id/orders", orderController.GetStoreOrders)
	}

	if err := router.Run(":" + cfg.ServerPort); err != nil {
		panic("failed to start server: " + err.Error())
	}

}
