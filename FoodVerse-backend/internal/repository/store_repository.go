package repository

import (
	"math"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"gorm.io/gorm"
)

type StoreRepository struct {
	db *gorm.DB
}

func NewStoreRepository(db *gorm.DB) *StoreRepository {
	return &StoreRepository{db: db}
}

func (r *StoreRepository) Create(store *model.Store) error {
	return r.db.Create(store).Error
}

func (r *StoreRepository) GetByID(id uint) (*model.Store, error) {
	var store model.Store
	err := r.db.Preload("Owner").Preload("FoodBags").First(&store, id).Error
	if err != nil {
		return nil, err
	}
	return &store, nil
}

func (r *StoreRepository) GetByOwnerID(ownerID uint) ([]model.Store, error) {
	var stores []model.Store
	err := r.db.Where("owner_id = ?", ownerID).Preload("FoodBags").Find(&stores).Error
	return stores, err
}

func (r *StoreRepository) Update(store *model.Store) error {
	return r.db.Save(store).Error
}

func (r *StoreRepository) Delete(id uint) error {
	return r.db.Delete(&model.Store{}, id).Error
}

func (r *StoreRepository) SearchNearby(req model.StoreSearchRequest) ([]model.StoreResponse, error) {
	var stores []model.Store
	radius := req.Radius
	if radius <= 0 {
		radius = 5.0 // default 5km
	}

	query := r.db.Where("is_active = ?", true)

	// Filter by category if provided
	if req.Category != "" {
		query = query.Where("category = ?", req.Category)
	}

	// Filter by name if query provided
	if req.Query != "" {
		query = query.Where("name ILIKE ?", "%"+req.Query+"%")
	}

	err := query.Find(&stores).Error
	if err != nil {
		return nil, err
	}

	var responses []model.StoreResponse
	for _, store := range stores {
		distance := r.calculateDistance(req.Latitude, req.Longitude, store.Latitude, store.Longitude)
		if distance <= radius {
			response := model.StoreResponse{
				ID:          store.ID,
				Name:        store.Name,
				Description: store.Description,
				Address:     store.Address,
				Latitude:    store.Latitude,
				Longitude:   store.Longitude,
				Phone:       store.Phone,
				Email:       store.Email,
				Category:    store.Category,
				ImageURL:    store.ImageURL,
				Rating:      store.Rating,
				Distance:    distance,
				CreatedAt:   store.CreatedAt,
				UpdatedAt:   store.UpdatedAt,
			}
			responses = append(responses, response)
		}
	}

	return responses, nil
}

// calculateDistance calculates the distance between two points using Haversine formula
func (r *StoreRepository) calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
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
