package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/FoodVerse/FoodVerse-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type OrderController struct {
	orderRepo   *repository.OrderRepository
	foodBagRepo *repository.FoodBagRepository
}

func NewOrderController(orderRepo *repository.OrderRepository, foodBagRepo *repository.FoodBagRepository) *OrderController {
	return &OrderController{
		orderRepo:   orderRepo,
		foodBagRepo: foodBagRepo,
	}
}

// @Summary Create a new order
// @Description Create a new order for a food bag
// @Tags orders
// @Accept json
// @Produce json
// @Param order body model.OrderInput true "Order data"
// @Success 201 {object} model.SwaggerOrder
// @Failure 400 {object} model.ErrorResponse
// @Failure 401 {object} model.ErrorResponse
// @Security Bearer
// @Router /orders [post]
func (c *OrderController) CreateOrder(ctx *gin.Context) {
	var input model.OrderInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get food bag details
	foodBag, err := c.foodBagRepo.GetByID(input.FoodBagID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Food bag not found"})
		return
	}

	// Check if enough quantity is available
	if foodBag.QuantityLeft < input.Quantity {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not enough quantity available"})
		return
	}

	// Check if food bag is still active
	if !foodBag.IsActive {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Food bag is no longer available"})
		return
	}

	totalPrice := foodBag.DiscountedPrice * float64(input.Quantity)

	order := &model.Order{
		UserID:     userID.(uint),
		FoodBagID:  input.FoodBagID,
		StoreID:    foodBag.StoreID,
		Quantity:   input.Quantity,
		TotalPrice: totalPrice,
		Status:     model.OrderStatusPending,
		Notes:      input.Notes,
	}

	if err := c.orderRepo.Create(order); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Update food bag quantity
	newQuantity := foodBag.QuantityLeft - input.Quantity
	if err := c.foodBagRepo.UpdateQuantity(foodBag.ID, newQuantity); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update food bag quantity"})
		return
	}

	// Get the created order with all relations
	createdOrder, err := c.orderRepo.GetByID(order.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get created order"})
		return
	}

	ctx.JSON(http.StatusCreated, createdOrder)
}

// @Summary Get order by ID
// @Description Get order details by ID
// @Tags orders
// @Produce json
// @Param id path int true "Order ID"
// @Success 200 {object} model.SwaggerOrder
// @Failure 400 {object} model.ErrorResponse
// @Failure 401 {object} model.ErrorResponse
// @Failure 403 {object} model.ErrorResponse
// @Failure 404 {object} model.ErrorResponse
// @Security Bearer
// @Router /orders/{id} [get]
func (c *OrderController) GetOrder(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	order, err := c.orderRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Check if user owns the order or the store
	if order.UserID != userID.(uint) && order.Store.OwnerID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to view this order"})
		return
	}

	ctx.JSON(http.StatusOK, order)
}

// @Summary Get user's orders
// @Description Get all orders for the authenticated user
// @Tags orders
// @Produce json
// @Success 200 {array} model.SwaggerOrder
// @Failure 401 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Security Bearer
// @Router /orders/my [get]
func (c *OrderController) GetMyOrders(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	orders, err := c.orderRepo.GetByUserID(userID.(uint))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get orders"})
		return
	}

	ctx.JSON(http.StatusOK, orders)
}

// @Summary Get store orders
// @Description Get all orders for a store
// @Tags orders
// @Produce json
// @Param store_id path int true "Store ID"
// @Success 200 {array} model.SwaggerOrder
// @Failure 400 {object} model.ErrorResponse
// @Failure 401 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Security Bearer
// @Router /stores/{store_id}/orders [get]
func (c *OrderController) GetStoreOrders(ctx *gin.Context) {
	storeID, err := strconv.ParseUint(ctx.Param("store_id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid store ID"})
		return
	}
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Verify that the user owns the store (for now, we'll skip this check)
	_ = userID // TODO: Implement store ownership verification

	orders, err := c.orderRepo.GetByStoreID(uint(storeID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get orders"})
		return
	}

	ctx.JSON(http.StatusOK, orders)
}

// @Summary Update order status
// @Description Update order status (for store owners)
// @Tags orders
// @Accept json
// @Produce json
// @Param id path int true "Order ID"
// @Param status body model.SwaggerOrderStatusUpdate true "New status"
// @Success 200 {object} model.SwaggerOrder
// @Failure 400 {object} model.ErrorResponse
// @Failure 401 {object} model.ErrorResponse
// @Failure 403 {object} model.ErrorResponse
// @Failure 404 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Security Bearer
// @Router /orders/{id}/status [put]
func (c *OrderController) UpdateOrderStatus(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var input struct {
		Status string `json:"status" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := c.orderRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Check if user owns the store
	if order.Store.OwnerID != userID.(uint) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to update this order"})
		return
	}

	status := model.OrderStatus(input.Status)
	if err := c.orderRepo.UpdateStatus(uint(id), status); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	// If order is completed, update picked up time
	if status == model.OrderStatusCompleted {
		now := time.Now()
		order.PickedUpAt = &now
		if err := c.orderRepo.Update(order); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update pickup time"})
			return
		}
	}

	// Get updated order
	updatedOrder, err := c.orderRepo.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get updated order"})
		return
	}

	ctx.JSON(http.StatusOK, updatedOrder)
}

// @Summary Verify pickup code
// @Description Verify pickup code and complete order
// @Tags orders
// @Accept json
// @Produce json
// @Param code body model.SwaggerPickupCodeRequest true "Pickup code"
// @Success 200 {object} model.SwaggerOrder
// @Failure 400 {object} model.ErrorResponse
// @Failure 404 {object} model.ErrorResponse
// @Failure 500 {object} model.ErrorResponse
// @Router /orders/verify-pickup [post]
func (c *OrderController) VerifyPickupCode(ctx *gin.Context) {
	var input struct {
		PickupCode string `json:"pickup_code" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := c.orderRepo.GetByPickupCode(input.PickupCode)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Invalid pickup code"})
		return
	}

	// Update order status to completed
	now := time.Now()
	order.Status = model.OrderStatusCompleted
	order.PickedUpAt = &now

	if err := c.orderRepo.Update(order); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete order"})
		return
	}

	ctx.JSON(http.StatusOK, order)
}
