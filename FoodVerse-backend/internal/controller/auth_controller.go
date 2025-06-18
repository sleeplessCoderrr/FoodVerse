package controller

import (
	"net/http"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/FoodVerse/FoodVerse-backend/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService *service.AuthService
}

func NewAuthController(authService *service.AuthService) *AuthController {
	return &AuthController{
		authService: authService}
}

// @Summary Register a new user
// @Description Register a new user account
// @Tags auth
// @Accept json
// @Produce json
// @Param user body model.UserInput true "User registration data"
// @Success 201 {object} model.AuthResponse
// @Failure 400 {object} model.ErrorResponse
// @Router /register [post]
func (c *AuthController) Register(ctx *gin.Context) {
	var input model.UserInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	response, err := c.authService.Register(&input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, response)
}

// @Summary Login user
// @Description Authenticate user and return JWT token
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body model.LoginInput true "User login credentials"
// @Success 200 {object} model.AuthResponse
// @Failure 400 {object} model.ErrorResponse
// @Router /login [post]
func (c *AuthController) Login(ctx *gin.Context) {
	var input model.LoginInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	response, err := c.authService.Login(&input)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

// @Summary Get user profile
// @Description Get current user profile information
// @Tags auth
// @Produce json
// @Success 200 {object} model.SwaggerUser
// @Failure 401 {object} model.ErrorResponse
// @Security Bearer
// @Router /user [get]
func (c *AuthController) Profile(ctx *gin.Context) {
	userId, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	user, err := c.authService.GetUserById(userId.(uint))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, user.ToDTO())
}

// @Summary Get user statistics
// @Description Get statistics for the current user (orders, savings, favorite categories)
// @Tags auth
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 401 {object} model.ErrorResponse
// @Security Bearer
// @Router /user/stats [get]
func (c *AuthController) UserStats(ctx *gin.Context) {
	userId, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	// Get user orders
	orders, err := c.authService.GetOrdersByUserId(userId.(uint))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	totalOrders := len(orders)
	completedOrders := 0
	totalSavings := 0.0
	categoryCount := map[string]int{}

	for _, order := range orders {
		if order.Status == "completed" {
			completedOrders++
		}
		if order.FoodBag.OriginalPrice > 0 && order.FoodBag.DiscountedPrice > 0 {
			savings := (order.FoodBag.OriginalPrice - order.FoodBag.DiscountedPrice) * float64(order.Quantity)
			if savings > 0 {
				totalSavings += savings
			}
		}
		cat := order.FoodBag.Category
		if cat != "" {
			categoryCount[cat]++
		}
	}

	// Get top 3 favorite categories
	favoriteCategories := []string{}
	for i := 0; i < 3; i++ {
		maxCount := 0
		maxCat := ""
		for cat, count := range categoryCount {
			if count > maxCount {
				maxCount = count
				maxCat = cat
			}
		}
		if maxCat == "" {
			break
		}
		favoriteCategories = append(favoriteCategories, maxCat)
		delete(categoryCount, maxCat)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"total_orders":        totalOrders,
		"completed_orders":    completedOrders,
		"total_savings":       totalSavings,
		"favorite_categories": favoriteCategories,
	})
}
