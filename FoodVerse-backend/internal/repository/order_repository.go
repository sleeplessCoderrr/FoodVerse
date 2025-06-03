package repository

import (
	"crypto/rand"
	"fmt"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) Create(order *model.Order) error {
	// Generate pickup code
	order.PickupCode = r.generatePickupCode()
	return r.db.Create(order).Error
}

func (r *OrderRepository) GetByID(id uint) (*model.Order, error) {
	var order model.Order
	err := r.db.Preload("User").Preload("FoodBag").Preload("Store").First(&order, id).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *OrderRepository) GetByUserID(userID uint) ([]model.Order, error) {
	var orders []model.Order
	err := r.db.Where("user_id = ?", userID).Preload("FoodBag").Preload("Store").Order("created_at desc").Find(&orders).Error
	return orders, err
}

func (r *OrderRepository) GetByStoreID(storeID uint) ([]model.Order, error) {
	var orders []model.Order
	err := r.db.Where("store_id = ?", storeID).Preload("User").Preload("FoodBag").Order("created_at desc").Find(&orders).Error
	return orders, err
}

func (r *OrderRepository) Update(order *model.Order) error {
	return r.db.Save(order).Error
}

func (r *OrderRepository) UpdateStatus(id uint, status model.OrderStatus) error {
	return r.db.Model(&model.Order{}).Where("id = ?", id).Update("status", status).Error
}

func (r *OrderRepository) GetByPickupCode(pickupCode string) (*model.Order, error) {
	var order model.Order
	err := r.db.Where("pickup_code = ?", pickupCode).Preload("User").Preload("FoodBag").Preload("Store").First(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *OrderRepository) generatePickupCode() string {
	bytes := make([]byte, 3)
	rand.Read(bytes)
	return fmt.Sprintf("%X", bytes)
}
