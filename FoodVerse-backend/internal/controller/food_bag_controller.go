package controller

import (
	"net/http"
	"strconv"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/FoodVerse/FoodVerse-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type FoodBagController struct {
	foodBagRepo *repository.FoodBagRepository
	storeRepo   *repository.StoreRepository
}

func NewFoodBagController(foodBagRepo *repository.FoodBagRepository, storeRepo *repository.StoreRepository) *FoodBagController {
	return &FoodBagController{
		foodBagRepo: foodBagRepo,
		storeRepo:   storeRepo,
	}
}

// @Summary Create a new food bag
// @Description Create a new food bag for a store
// @Tags food-bags
// @Accept json
// @Produce json
// @Param foodbag body model.FoodBagInput true "Food bag data"
// @Success 201 {object} model.FoodBag
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /food-bags [post]
func (c *FoodBagController) CreateFoodBag(ctx *gin.Context) {
	var input model.FoodBagInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Verify that the user owns the store
	store, err := c.storeRepo.GetByID(input.StoreID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Store not found"})
		return
	}

	if store.OwnerID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to create food bags for this store"})
		return
	}

	foodBag := &model.FoodBag{
		StoreID:         input.StoreID,
		Title:           input.Title,
		Description:     input.Description,
		OriginalPrice:   input.OriginalPrice,
		DiscountedPrice: input.DiscountedPrice,
		QuantityTotal:   input.QuantityTotal,
		PickupTimeStart: input.PickupTimeStart,
		PickupTimeEnd:   input.PickupTimeEnd,
		ImageURL:        input.ImageURL,
		Category:        input.Category,
		IsActive:        true,
	}

	if err := c.foodBagRepo.Create(foodBag); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create food bag"})
		return
	}

	ctx.JSON(http.StatusCreated, foodBag)
}

// @Summary Get food bag by ID
// @Description Get food bag details by ID
// @Tags food-bags
// @Produce json
// @Param id path int true "Food bag ID"
// @Success 200 {object} model.FoodBag
// @Failure 404 {object} map[string]string
// @Router /food-bags/{id} [get]
func (c *FoodBagController) GetFoodBag(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid food bag ID"})
		return
	}

	foodBag, err := c.foodBagRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Food bag not found"})
		return
	}

	ctx.JSON(http.StatusOK, foodBag)
}

// @Summary Search nearby food bags
// @Description Search for food bags near a location
// @Tags food-bags
// @Accept json
// @Produce json
// @Param search body model.FoodBagSearchRequest true "Search criteria"
// @Success 200 {array} model.FoodBagResponse
// @Failure 400 {object} map[string]string
// @Router /food-bags/search [post]
func (c *FoodBagController) SearchFoodBags(ctx *gin.Context) {
	var req model.FoodBagSearchRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	foodBags, err := c.foodBagRepo.SearchNearby(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search food bags"})
		return
	}

	ctx.JSON(http.StatusOK, foodBags)
}

// @Summary Get food bags by store
// @Description Get all food bags for a specific store
// @Tags food-bags
// @Produce json
// @Param store_id path int true "Store ID"
// @Success 200 {array} model.FoodBag
// @Failure 400 {object} map[string]string
// @Router /stores/{store_id}/food-bags [get]
func (c *FoodBagController) GetFoodBagsByStore(ctx *gin.Context) {
	storeID, err := strconv.ParseUint(ctx.Param("store_id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid store ID"})
		return
	}

	foodBags, err := c.foodBagRepo.GetByStoreID(uint(storeID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get food bags"})
		return
	}

	ctx.JSON(http.StatusOK, foodBags)
}

// @Summary Update food bag
// @Description Update food bag details
// @Tags food-bags
// @Accept json
// @Produce json
// @Param id path int true "Food bag ID"
// @Param foodbag body model.FoodBagInput true "Food bag data"
// @Success 200 {object} model.FoodBag
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /food-bags/{id} [put]
func (c *FoodBagController) UpdateFoodBag(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid food bag ID"})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	foodBag, err := c.foodBagRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Food bag not found"})
		return
	}

	// Check if user owns the store
	if foodBag.Store.OwnerID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this food bag"})
		return
	}

	var input model.FoodBagInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	foodBag.Title = input.Title
	foodBag.Description = input.Description
	foodBag.OriginalPrice = input.OriginalPrice
	foodBag.DiscountedPrice = input.DiscountedPrice
	foodBag.QuantityTotal = input.QuantityTotal
	foodBag.PickupTimeStart = input.PickupTimeStart
	foodBag.PickupTimeEnd = input.PickupTimeEnd
	foodBag.ImageURL = input.ImageURL
	foodBag.Category = input.Category

	if err := c.foodBagRepo.Update(foodBag); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update food bag"})
		return
	}

	ctx.JSON(http.StatusOK, foodBag)
}

// @Summary Delete food bag
// @Description Delete a food bag
// @Tags food-bags
// @Param id path int true "Food bag ID"
// @Success 204
// @Failure 401 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /food-bags/{id} [delete]
func (c *FoodBagController) DeleteFoodBag(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid food bag ID"})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	foodBag, err := c.foodBagRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Food bag not found"})
		return
	}

	// Check if user owns the store
	if foodBag.Store.OwnerID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this food bag"})
		return
	}

	if err := c.foodBagRepo.Delete(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete food bag"})
		return
	}

	ctx.Status(http.StatusNoContent)
}
