package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SellerRequestController struct {
	db *gorm.DB
}

func NewSellerRequestController(db *gorm.DB) *SellerRequestController {
	return &SellerRequestController{db: db}
}

// CreateSellerRequest creates a new seller request
func (c *SellerRequestController) CreateSellerRequest(ctx *gin.Context) {
	var input model.SellerRequestInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Get user ID from context (set by JWT middleware)
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Check if user already has a pending or approved request
	var existingRequest model.SellerRequest
	err := c.db.Where("user_id = ? AND status IN ?", userID, []string{"pending", "approved"}).First(&existingRequest).Error
	if err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "You already have a pending or approved seller request"})
		return
	}

	// Check if user is already a seller
	var user model.User
	if err := c.db.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.UserType == model.UserTypeSeller {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "You are already a seller"})
		return
	}

	sellerRequest := model.SellerRequest{
		UserID:       userID.(uint),
		IDNumber:     input.IDNumber,
		Reason:       input.Reason,
		Location:     input.Location,
		FaceImageURL: input.FaceImageURL,
		Status:       model.SellerRequestStatusPending,
	}

	if err := c.db.Create(&sellerRequest).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create seller request"})
		return
	}

	// Load the user relationship
	c.db.Preload("User").First(&sellerRequest, sellerRequest.ID)

	ctx.JSON(http.StatusCreated, sellerRequest.ToResponse())
}

// GetSellerRequests gets all seller requests (admin only)
func (c *SellerRequestController) GetSellerRequests(ctx *gin.Context) {
	// Check if user is admin
	userType, exists := ctx.Get("userType")
	if !exists || userType != model.UserTypeAdmin {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	status := ctx.Query("status")
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	query := c.db.Preload("User").Preload("ReviewedBy")
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var requests []model.SellerRequest
	var total int64

	query.Model(&model.SellerRequest{}).Count(&total)
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&requests).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch seller requests"})
		return
	}

	var responses []model.SellerRequestResponse
	for _, request := range requests {
		responses = append(responses, request.ToResponse())
	}

	ctx.JSON(http.StatusOK, gin.H{
		"requests": responses,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

// GetMySellerRequest gets the current user's seller request
func (c *SellerRequestController) GetMySellerRequest(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var request model.SellerRequest
	if err := c.db.Preload("User").Preload("ReviewedBy").Where("user_id = ?", userID).First(&request).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "No seller request found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch seller request"})
		return
	}

	ctx.JSON(http.StatusOK, request.ToResponse())
}

// UpdateSellerRequest updates a seller request (admin only)
func (c *SellerRequestController) UpdateSellerRequest(ctx *gin.Context) {
	// Check if user is admin
	userType, exists := ctx.Get("userType")
	if !exists || userType != model.UserTypeAdmin {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	requestID := ctx.Param("id")
	var input model.SellerRequestUpdateInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminID, _ := ctx.Get("userID")

	var request model.SellerRequest
	if err := c.db.Preload("User").First(&request, requestID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Seller request not found"})
		return
	}

	// Update the request
	now := time.Now()
	request.Status = input.Status
	request.AdminComments = input.AdminComments
	request.ReviewedByID = &[]uint{adminID.(uint)}[0]
	request.ReviewedAt = &now

	if err := c.db.Save(&request).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seller request"})
		return
	}

	// If approved, update user type to seller
	if input.Status == model.SellerRequestStatusApproved {
		if err := c.db.Model(&request.User).Update("user_type", model.UserTypeSeller).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user type"})
			return
		}
	}

	// Reload with relationships
	c.db.Preload("User").Preload("ReviewedBy").First(&request, request.ID)

	ctx.JSON(http.StatusOK, request.ToResponse())
}
