package model

import "time"

// SwaggerFoodBag represents a food bag for Swagger documentation
type SwaggerFoodBag struct {
	ID              uint         `json:"id" example:"1"`
	CreatedAt       time.Time    `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt       time.Time    `json:"updated_at" example:"2023-01-01T00:00:00Z"`
	StoreID         uint         `json:"store_id" example:"1"`
	Store           SwaggerStore `json:"store"`
	Title           string       `json:"title" example:"Mixed Food Bag"`
	Description     string       `json:"description" example:"Assorted fresh items"`
	OriginalPrice   float64      `json:"original_price" example:"25.00"`
	DiscountedPrice float64      `json:"discounted_price" example:"10.00"`
	QuantityTotal   int          `json:"quantity_total" example:"5"`
	QuantityLeft    int          `json:"quantity_left" example:"3"`
	PickupTimeStart time.Time    `json:"pickup_time_start" example:"2023-01-01T18:00:00Z"`
	PickupTimeEnd   time.Time    `json:"pickup_time_end" example:"2023-01-01T21:00:00Z"`
	ImageURL        string       `json:"image_url" example:"https://example.com/image.jpg"`
	Category        string       `json:"category" example:"Mixed"`
	IsActive        bool         `json:"is_active" example:"true"`
}

// SwaggerStore represents a store for Swagger documentation
type SwaggerStore struct {
	ID          uint      `json:"id" example:"1"`
	CreatedAt   time.Time `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt   time.Time `json:"updated_at" example:"2023-01-01T00:00:00Z"`
	OwnerID     uint      `json:"owner_id" example:"1"`
	Name        string    `json:"name" example:"Green Grocery"`
	Description string    `json:"description" example:"Fresh organic produce"`
	Address     string    `json:"address" example:"123 Main St"`
	Latitude    float64   `json:"latitude" example:"40.7128"`
	Longitude   float64   `json:"longitude" example:"-74.0060"`
	Phone       string    `json:"phone" example:"+1234567890"`
	Email       string    `json:"email" example:"store@example.com"`
	Category    string    `json:"category" example:"Grocery"`
	ImageURL    string    `json:"image_url" example:"https://example.com/store.jpg"`
	IsActive    bool      `json:"is_active" example:"true"`
}

// SwaggerOrder represents an order for Swagger documentation
type SwaggerOrder struct {
	ID         uint           `json:"id" example:"1"`
	CreatedAt  time.Time      `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt  time.Time      `json:"updated_at" example:"2023-01-01T00:00:00Z"`
	UserID     uint           `json:"user_id" example:"1"`
	User       SwaggerUser    `json:"user"`
	FoodBagID  uint           `json:"food_bag_id" example:"1"`
	FoodBag    SwaggerFoodBag `json:"food_bag"`
	StoreID    uint           `json:"store_id" example:"1"`
	Store      SwaggerStore   `json:"store"`
	Quantity   int            `json:"quantity" example:"2"`
	TotalPrice float64        `json:"total_price" example:"20.00"`
	Status     string         `json:"status" example:"pending"`
	PickupCode string         `json:"pickup_code" example:"ABC123"`
	OrderDate  time.Time      `json:"order_date" example:"2023-01-01T12:00:00Z"`
	PickedUpAt *time.Time     `json:"picked_up_at,omitempty" example:"2023-01-01T19:00:00Z"`
}

// SwaggerUser represents a user for Swagger documentation
type SwaggerUser struct {
	ID        uint      `json:"id" example:"1"`
	CreatedAt time.Time `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt time.Time `json:"updated_at" example:"2023-01-01T00:00:00Z"`
	Name      string    `json:"name" example:"John Doe"`
	Email     string    `json:"email" example:"john@example.com"`
	UserType  string    `json:"user_type" example:"consumer"`
	Phone     string    `json:"phone" example:"+1234567890"`
	Address   string    `json:"address" example:"456 Oak St"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error" example:"Something went wrong"`
}

// SwaggerFoodBagSearchRequest represents a food bag search request for Swagger
type SwaggerFoodBagSearchRequest struct {
	Latitude  float64 `json:"latitude" binding:"required" example:"40.7128"`
	Longitude float64 `json:"longitude" binding:"required" example:"-74.0060"`
	Radius    float64 `json:"radius" example:"5.0"`
	Category  string  `json:"category,omitempty" example:"Mixed"`
	MaxPrice  float64 `json:"max_price,omitempty" example:"20.00"`
	MinPrice  float64 `json:"min_price,omitempty" example:"5.00"`
}

// SwaggerFoodBagResponse represents a food bag response for Swagger
type SwaggerFoodBagResponse struct {
	ID              uint                 `json:"id" example:"1"`
	Title           string               `json:"title" example:"Mixed Food Bag"`
	Description     string               `json:"description" example:"Assorted fresh items"`
	OriginalPrice   float64              `json:"original_price" example:"25.00"`
	DiscountedPrice float64              `json:"discounted_price" example:"10.00"`
	DiscountPercent int                  `json:"discount_percent" example:"60"`
	QuantityLeft    int                  `json:"quantity_left" example:"3"`
	PickupTimeStart time.Time            `json:"pickup_time_start" example:"2023-01-01T18:00:00Z"`
	PickupTimeEnd   time.Time            `json:"pickup_time_end" example:"2023-01-01T21:00:00Z"`
	ImageURL        string               `json:"image_url" example:"https://example.com/image.jpg"`
	Category        string               `json:"category" example:"Mixed"`
	Store           SwaggerStoreResponse `json:"store"`
	CreatedAt       time.Time            `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt       time.Time            `json:"updated_at" example:"2023-01-01T00:00:00Z"`
}

// SwaggerStoreSearchRequest represents a store search request for Swagger
type SwaggerStoreSearchRequest struct {
	Latitude  float64 `json:"latitude" binding:"required" example:"40.7128"`
	Longitude float64 `json:"longitude" binding:"required" example:"-74.0060"`
	Radius    float64 `json:"radius" example:"5.0"`
	Category  string  `json:"category,omitempty" example:"Grocery"`
	Query     string  `json:"query,omitempty" example:"Green"`
}

// SwaggerStoreResponse represents a store response for Swagger
type SwaggerStoreResponse struct {
	ID          uint      `json:"id" example:"1"`
	Name        string    `json:"name" example:"Green Grocery"`
	Description string    `json:"description" example:"Fresh organic produce"`
	Address     string    `json:"address" example:"123 Main St"`
	Latitude    float64   `json:"latitude" example:"40.7128"`
	Longitude   float64   `json:"longitude" example:"-74.0060"`
	Phone       string    `json:"phone" example:"+1234567890"`
	Email       string    `json:"email" example:"store@example.com"`
	Category    string    `json:"category" example:"Grocery"`
	ImageURL    string    `json:"image_url" example:"https://example.com/store.jpg"`
	Rating      float32   `json:"rating" example:"4.5"`
	IsActive    bool      `json:"is_active" example:"true"`
	CreatedAt   time.Time `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt   time.Time `json:"updated_at" example:"2023-01-01T00:00:00Z"`
}

// SwaggerOrderStatusUpdate represents order status update request for Swagger
type SwaggerOrderStatusUpdate struct {
	Status string `json:"status" binding:"required" example:"completed" enums:"pending,preparing,ready,completed,cancelled"`
}

// SwaggerPickupCodeRequest represents pickup code verification request for Swagger
type SwaggerPickupCodeRequest struct {
	PickupCode string `json:"pickup_code" binding:"required" example:"ABC123"`
}
