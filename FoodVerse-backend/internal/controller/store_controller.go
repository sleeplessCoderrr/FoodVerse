package controller

import (
	"net/http"
	"strconv"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/FoodVerse/FoodVerse-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type StoreController struct {
	storeRepo *repository.StoreRepository
}

func NewStoreController(storeRepo *repository.StoreRepository) *StoreController {
	return &StoreController{storeRepo: storeRepo}
}

// @Summary Create a new store
// @Description Create a new store for a business user
// @Tags stores
// @Accept json
// @Produce json
// @Param store body model.StoreInput true "Store data"
// @Success 201 {object} model.SwaggerStore
// @Failure 400 {object} model.ErrorResponse
// @Failure 401 {object} model.ErrorResponse
// @Security Bearer
// @Router /stores [post]
func (c *StoreController) CreateStore(ctx *gin.Context) {
	var input model.StoreInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from JWT token
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	store := &model.Store{
		Name:        input.Name,
		Description: input.Description,
		Address:     input.Address,
		Latitude:    input.Latitude,
		Longitude:   input.Longitude,
		Phone:       input.Phone,
		Email:       input.Email,
		Category:    input.Category,
		ImageURL:    input.ImageURL,
		OwnerID:     userID.(uint),
		IsActive:    true,
	}

	if err := c.storeRepo.Create(store); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create store"})
		return
	}

	ctx.JSON(http.StatusCreated, store)
}

// @Summary Get store by ID
// @Description Get store details by ID
// @Tags stores
// @Produce json
// @Param id path int true "Store ID"
// @Success 200 {object} model.SwaggerStore
// @Failure 400 {object} model.ErrorResponse
// @Failure 404 {object} model.ErrorResponse
// @Router /stores/{id} [get]
func (c *StoreController) GetStore(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid store ID"})
		return
	}

	store, err := c.storeRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Store not found"})
		return
	}

	ctx.JSON(http.StatusOK, store)
}

// @Summary Search nearby stores
// @Description Search for stores near a location
// @Tags stores
// @Accept json
// @Produce json
// @Param search body model.SwaggerStoreSearchRequest true "Search criteria"
// @Success 200 {array} model.SwaggerStoreResponse
// @Failure 400 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /stores/search [post]
func (c *StoreController) SearchStores(ctx *gin.Context) {
	var req model.StoreSearchRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	stores, err := c.storeRepo.SearchNearby(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search stores"})
		return
	}

	ctx.JSON(http.StatusOK, stores)
}

// @Summary Get user's stores
// @Description Get all stores owned by the authenticated user
// @Tags stores
// @Produce json
// @Success 200 {array} model.SwaggerStore
// @Failure 401 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Security Bearer
// @Router /stores/my [get]
func (c *StoreController) GetMyStores(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	stores, err := c.storeRepo.GetByOwnerID(userID.(uint))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get stores"})
		return
	}

	ctx.JSON(http.StatusOK, stores)
}

// @Summary Get owned stores
// @Description Get all stores owned by the authenticated business user
// @Tags stores
// @Produce json
// @Success 200 {object} map[string][]model.Store
// @Failure 401 {object} map[string]string
// @Security Bearer
// @Router /stores/owned [get]
func (c *StoreController) GetOwnedStores(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	stores, err := c.storeRepo.GetByOwnerID(userID.(uint))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch stores"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": stores})
}

// @Summary Update store
// @Description Update store details
// @Tags stores
// @Accept json
// @Produce json
// @Param id path int true "Store ID"
// @Param store body model.StoreInput true "Store data"
// @Success 200 {object} model.SwaggerStore
// @Failure 400 {object} model.ErrorResponse
// @Failure 401 {object} model.ErrorResponse
// @Failure 403 {object} model.ErrorResponse
// @Failure 404 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Security Bearer
// @Router /stores/{id} [put]
func (c *StoreController) UpdateStore(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid store ID"})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	store, err := c.storeRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Store not found"})
		return
	}

	// Check if user owns the store
	if store.OwnerID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this store"})
		return
	}

	var input model.StoreInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	store.Name = input.Name
	store.Description = input.Description
	store.Address = input.Address
	store.Latitude = input.Latitude
	store.Longitude = input.Longitude
	store.Phone = input.Phone
	store.Email = input.Email
	store.Category = input.Category
	store.ImageURL = input.ImageURL

	if err := c.storeRepo.Update(store); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update store"})
		return
	}

	ctx.JSON(http.StatusOK, store)
}

// @Summary Delete store
// @Description Delete a store
// @Tags stores
// @Param id path int true "Store ID"
// @Success 204
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /stores/{id} [delete]
func (c *StoreController) DeleteStore(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid store ID"})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	store, err := c.storeRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Store not found"})
		return
	}

	// Check if user owns the store
	if store.OwnerID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this store"})
		return
	}

	if err := c.storeRepo.Delete(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete store"})
		return
	}

	ctx.Status(http.StatusNoContent)
}
