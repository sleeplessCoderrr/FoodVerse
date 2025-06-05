package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/FoodVerse/FoodVerse-backend/internal/repository"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SellerRequestController struct {
	sellerRequestRepo *repository.SellerRequestRepository
	userRepo          *repository.UserRepository
}

func NewSellerRequestController(sellerRequestRepo *repository.SellerRequestRepository, userRepo *repository.UserRepository) *SellerRequestController {
	return &SellerRequestController{
		sellerRequestRepo: sellerRequestRepo,
		userRepo:          userRepo,
	}
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
	_, err := c.sellerRequestRepo.GetPendingOrApprovedByUserID(userID.(uint))
	if err == nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "You already have a pending or approved seller request"})
		return
	}
	// Check if user is already a seller
	user, err := c.userRepo.FindUserById(userID.(uint))
	if err != nil {
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
	if err := c.sellerRequestRepo.Create(&sellerRequest); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create seller request"})
		return
	}

	// Reload with relationships
	createdRequest, err := c.sellerRequestRepo.GetByID(sellerRequest.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load created request"})
		return
	}

	ctx.JSON(http.StatusCreated, createdRequest.ToResponse())
}

// GetSellerRequests gets all seller requests (admin only)
func (c *SellerRequestController) GetSellerRequests(ctx *gin.Context) {
	// Check if user is admin
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	// Get user to check if they are admin
	user, userErr := c.userRepo.FindUserById(userID.(uint))
	if userErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	if user.UserType != model.UserTypeAdmin {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	status := ctx.Query("status")
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var requests []model.SellerRequest
	var total int64
	var err error

	if status != "" {
		requests, total, err = c.sellerRequestRepo.GetByStatus(model.SellerRequestStatus(status), limit, offset)
	} else {
		requests, total, err = c.sellerRequestRepo.GetAll(limit, offset)
	}

	if err != nil {
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

	request, err := c.sellerRequestRepo.GetByUserID(userID.(uint))
	if err != nil {
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
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get user to check if they are admin
	user, userErr := c.userRepo.FindUserById(userID.(uint))
	if userErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	if user.UserType != model.UserTypeAdmin {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	requestID := ctx.Param("id")
	var input model.SellerRequestUpdateInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminID := userID

	// Convert requestID to uint
	id, err := strconv.ParseUint(requestID, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request ID"})
		return
	}

	request, err := c.sellerRequestRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Seller request not found"})
		return
	}

	// Update the request
	now := time.Now()
	request.Status = input.Status
	request.AdminComments = input.AdminComments
	request.ReviewedByID = &[]uint{adminID.(uint)}[0]
	request.ReviewedAt = &now

	if err := c.sellerRequestRepo.Update(request); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seller request"})
		return
	}

	// If approved, update user type to seller
	if input.Status == model.SellerRequestStatusApproved {
		user, err := c.userRepo.FindUserById(request.UserID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user"})
			return
		}
		user.UserType = model.UserTypeSeller
		if err := c.userRepo.UpdateUser(user); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user type"})
			return
		}
	}
	// Reload with relationships
	updatedRequest, err := c.sellerRequestRepo.GetByID(request.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reload request"})
		return
	}

	ctx.JSON(http.StatusOK, updatedRequest.ToResponse())
}
