package model

import (
	"time"

	"gorm.io/gorm"
)

type FoodBag struct {
	gorm.Model
	StoreID         uint      `json:"store_id" binding:"required"`
	Store           Store     `json:"store" gorm:"foreignKey:StoreID"`
	Title           string    `json:"title" binding:"required"`
	Description     string    `json:"description"`
	OriginalPrice   float64   `json:"original_price" binding:"required"`
	DiscountedPrice float64   `json:"discounted_price" binding:"required"`
	QuantityTotal   int       `json:"quantity_total" binding:"required"`
	QuantityLeft    int       `json:"quantity_left"`
	PickupTimeStart time.Time `json:"pickup_time_start" binding:"required"`
	PickupTimeEnd   time.Time `json:"pickup_time_end" binding:"required"`
	ImageURL        string    `json:"image_url"`
	Category        string    `json:"category"` // same as store category or specific food type
	IsActive        bool      `json:"is_active" gorm:"default:true"`
	Orders          []Order   `json:"orders,omitempty"`
}

type FoodBagInput struct {
	StoreID         uint      `json:"store_id" binding:"required"`
	Title           string    `json:"title" binding:"required"`
	Description     string    `json:"description"`
	OriginalPrice   float64   `json:"original_price" binding:"required"`
	DiscountedPrice float64   `json:"discounted_price" binding:"required"`
	QuantityTotal   int       `json:"quantity_total" binding:"required"`
	PickupTimeStart time.Time `json:"pickup_time_start" binding:"required"`
	PickupTimeEnd   time.Time `json:"pickup_time_end" binding:"required"`
	ImageURL        string    `json:"image_url"`
	Category        string    `json:"category"`
}

type FoodBagSearchRequest struct {
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
	Radius    float64 `json:"radius"` // in kilometers, default 5km
	Category  string  `json:"category,omitempty"`
	MaxPrice  float64 `json:"max_price,omitempty"`
	MinPrice  float64 `json:"min_price,omitempty"`
}

type FoodBagResponse struct {
	ID              uint          `json:"id"`
	Title           string        `json:"title"`
	Description     string        `json:"description"`
	OriginalPrice   float64       `json:"original_price"`
	DiscountedPrice float64       `json:"discounted_price"`
	DiscountPercent int           `json:"discount_percent"`
	QuantityLeft    int           `json:"quantity_left"`
	PickupTimeStart time.Time     `json:"pickup_time_start"`
	PickupTimeEnd   time.Time     `json:"pickup_time_end"`
	ImageURL        string        `json:"image_url"`
	Category        string        `json:"category"`
	Store           StoreResponse `json:"store"`
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
}
