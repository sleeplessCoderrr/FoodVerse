package repository

import (
	"math"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"gorm.io/gorm"
)

type FoodBagRepository struct {
	db *gorm.DB
}

func NewFoodBagRepository(db *gorm.DB) *FoodBagRepository {
	return &FoodBagRepository{db: db}
}

func (r *FoodBagRepository) Create(foodBag *model.FoodBag) error {
	foodBag.QuantityLeft = foodBag.QuantityTotal
	return r.db.Create(foodBag).Error
}

func (r *FoodBagRepository) GetByID(id uint) (*model.FoodBag, error) {
	var foodBag model.FoodBag
	err := r.db.Preload("Store").First(&foodBag, id).Error
	if err != nil {
		return nil, err
	}
	return &foodBag, nil
}

func (r *FoodBagRepository) GetByStoreID(storeID uint) ([]model.FoodBag, error) {
	var foodBags []model.FoodBag
	err := r.db.Where("store_id = ? AND is_active = ?", storeID, true).Preload("Store").Find(&foodBags).Error
	return foodBags, err
}

func (r *FoodBagRepository) Update(foodBag *model.FoodBag) error {
	return r.db.Save(foodBag).Error
}

func (r *FoodBagRepository) Delete(id uint) error {
	return r.db.Delete(&model.FoodBag{}, id).Error
}

func (r *FoodBagRepository) SearchNearby(req model.FoodBagSearchRequest) ([]model.FoodBagResponse, error) {
	var foodBags []model.FoodBag
	radius := req.Radius
	if radius <= 0 {
		radius = 5.0 // default 5km
	}

	query := r.db.Where("is_active = ? AND quantity_left > 0", true).Preload("Store")

	// Filter by category if provided
	if req.Category != "" {
		query = query.Where("category = ?", req.Category)
	}

	// Filter by price range if provided
	if req.MaxPrice > 0 {
		query = query.Where("discounted_price <= ?", req.MaxPrice)
	}
	if req.MinPrice > 0 {
		query = query.Where("discounted_price >= ?", req.MinPrice)
	}

	err := query.Find(&foodBags).Error
	if err != nil {
		return nil, err
	}

	var responses []model.FoodBagResponse
	for _, foodBag := range foodBags {
		distance := r.calculateDistance(req.Latitude, req.Longitude, foodBag.Store.Latitude, foodBag.Store.Longitude)
		if distance <= radius {
			discountPercent := int(((foodBag.OriginalPrice - foodBag.DiscountedPrice) / foodBag.OriginalPrice) * 100)

			storeResponse := model.StoreResponse{
				ID:        foodBag.Store.ID,
				Name:      foodBag.Store.Name,
				Address:   foodBag.Store.Address,
				Category:  foodBag.Store.Category,
				ImageURL:  foodBag.Store.ImageURL,
				Rating:    foodBag.Store.Rating,
				Distance:  distance,
				CreatedAt: foodBag.Store.CreatedAt,
				UpdatedAt: foodBag.Store.UpdatedAt,
			}

			response := model.FoodBagResponse{
				ID:              foodBag.ID,
				Title:           foodBag.Title,
				Description:     foodBag.Description,
				OriginalPrice:   foodBag.OriginalPrice,
				DiscountedPrice: foodBag.DiscountedPrice,
				DiscountPercent: discountPercent,
				QuantityLeft:    foodBag.QuantityLeft,
				PickupTimeStart: foodBag.PickupTimeStart,
				PickupTimeEnd:   foodBag.PickupTimeEnd,
				ImageURL:        foodBag.ImageURL,
				Category:        foodBag.Category,
				Store:           storeResponse,
				CreatedAt:       foodBag.CreatedAt,
				UpdatedAt:       foodBag.UpdatedAt,
			}
			responses = append(responses, response)
		}
	}

	return responses, nil
}

func (r *FoodBagRepository) UpdateQuantity(id uint, newQuantity int) error {
	return r.db.Model(&model.FoodBag{}).Where("id = ?", id).Update("quantity_left", newQuantity).Error
}

// calculateDistance calculates the distance between two points using Haversine formula
func (r *FoodBagRepository) calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const earthRadius = 6371 // Earth radius in kilometers

	dLat := (lat2 - lat1) * math.Pi / 180.0
	dLon := (lon2 - lon1) * math.Pi / 180.0

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*math.Pi/180.0)*math.Cos(lat2*math.Pi/180.0)*
			math.Sin(dLon/2)*math.Sin(dLon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	distance := earthRadius * c

	return distance
}
