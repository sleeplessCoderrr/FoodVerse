package model

import (
	"time"

	"gorm.io/gorm"
)

type Store struct {
	gorm.Model
	Name        string    `json:"name" binding:"required"`
	Description string    `json:"description"`
	Address     string    `json:"address" binding:"required"`
	Latitude    float64   `json:"latitude" binding:"required"`
	Longitude   float64   `json:"longitude" binding:"required"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email"`
	Category    string    `json:"category" binding:"required"` // bakery, restaurant, grocery, cafe
	ImageURL    string    `json:"image_url"`
	Rating      float32   `json:"rating"`
	IsActive    bool      `json:"is_active" gorm:"default:true"`
	OwnerID     uint      `json:"owner_id"`
	Owner       User      `json:"owner" gorm:"foreignKey:OwnerID"`
	FoodBags    []FoodBag `json:"food_bags,omitempty"`
}

type StoreInput struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Address     string  `json:"address" binding:"required"`
	Latitude    float64 `json:"latitude" binding:"required"`
	Longitude   float64 `json:"longitude" binding:"required"`
	Phone       string  `json:"phone"`
	Email       string  `json:"email"`
	Category    string  `json:"category" binding:"required"`
	ImageURL    string  `json:"image_url"`
}

type StoreSearchRequest struct {
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
	Radius    float64 `json:"radius"` // in kilometers, default 5km
	Category  string  `json:"category,omitempty"`
	Query     string  `json:"query,omitempty"`
}

type StoreResponse struct {
	ID          uint      `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Address     string    `json:"address"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email"`
	Category    string    `json:"category"`
	ImageURL    string    `json:"image_url"`
	Rating      float32   `json:"rating"`
	Distance    float64   `json:"distance"` // in kilometers
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
