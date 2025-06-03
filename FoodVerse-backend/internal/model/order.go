package model

import (
	"time"

	"gorm.io/gorm"
)

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusConfirmed OrderStatus = "confirmed"
	OrderStatusReady     OrderStatus = "ready"
	OrderStatusCompleted OrderStatus = "completed"
	OrderStatusCancelled OrderStatus = "cancelled"
)

type Order struct {
	gorm.Model
	UserID     uint        `json:"user_id" binding:"required"`
	User       User        `json:"user" gorm:"foreignKey:UserID"`
	FoodBagID  uint        `json:"food_bag_id" binding:"required"`
	FoodBag    FoodBag     `json:"food_bag" gorm:"foreignKey:FoodBagID"`
	StoreID    uint        `json:"store_id"`
	Store      Store       `json:"store" gorm:"foreignKey:StoreID"`
	Quantity   int         `json:"quantity" binding:"required"`
	TotalPrice float64     `json:"total_price"`
	Status     OrderStatus `json:"status" gorm:"default:'pending'"`
	PickupCode string      `json:"pickup_code"`
	Notes      string      `json:"notes"`
	PickedUpAt *time.Time  `json:"picked_up_at,omitempty"`
}

type OrderInput struct {
	FoodBagID uint   `json:"food_bag_id" binding:"required"`
	Quantity  int    `json:"quantity" binding:"required"`
	Notes     string `json:"notes"`
}

type OrderResponse struct {
	ID         uint            `json:"id"`
	Quantity   int             `json:"quantity"`
	TotalPrice float64         `json:"total_price"`
	Status     OrderStatus     `json:"status"`
	PickupCode string          `json:"pickup_code"`
	Notes      string          `json:"notes"`
	FoodBag    FoodBagResponse `json:"food_bag"`
	Store      StoreResponse   `json:"store"`
	CreatedAt  time.Time       `json:"created_at"`
	UpdatedAt  time.Time       `json:"updated_at"`
	PickedUpAt *time.Time      `json:"picked_up_at,omitempty"`
}
