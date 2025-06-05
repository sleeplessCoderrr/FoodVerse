package repository

import (
	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"gorm.io/gorm"
)

type SellerRequestRepository struct {
	db *gorm.DB
}

func NewSellerRequestRepository(db *gorm.DB) *SellerRequestRepository {
	return &SellerRequestRepository{db: db}
}

func (r *SellerRequestRepository) Create(sellerRequest *model.SellerRequest) error {
	return r.db.Create(sellerRequest).Error
}

func (r *SellerRequestRepository) GetByID(id uint) (*model.SellerRequest, error) {
	var sellerRequest model.SellerRequest
	err := r.db.Preload("User").Preload("ReviewedBy").First(&sellerRequest, id).Error
	if err != nil {
		return nil, err
	}
	return &sellerRequest, nil
}

func (r *SellerRequestRepository) GetByUserID(userID uint) (*model.SellerRequest, error) {
	var sellerRequest model.SellerRequest
	err := r.db.Preload("User").Preload("ReviewedBy").Where("user_id = ?", userID).First(&sellerRequest).Error
	if err != nil {
		return nil, err
	}
	return &sellerRequest, nil
}

func (r *SellerRequestRepository) GetPendingOrApprovedByUserID(userID uint) (*model.SellerRequest, error) {
	var sellerRequest model.SellerRequest
	err := r.db.Where("user_id = ? AND status IN ?", userID, []string{"pending", "approved"}).First(&sellerRequest).Error
	if err != nil {
		return nil, err
	}
	return &sellerRequest, nil
}

func (r *SellerRequestRepository) GetAll(limit, offset int) ([]model.SellerRequest, int64, error) {
	var sellerRequests []model.SellerRequest
	var total int64

	// Get total count
	if err := r.db.Model(&model.SellerRequest{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := r.db.Preload("User").Preload("ReviewedBy").
		Limit(limit).Offset(offset).
		Order("created_at DESC").
		Find(&sellerRequests).Error
	return sellerRequests, total, err
}

func (r *SellerRequestRepository) GetByStatus(status model.SellerRequestStatus, limit, offset int) ([]model.SellerRequest, int64, error) {
	var sellerRequests []model.SellerRequest
	var total int64

	// Get total count
	if err := r.db.Model(&model.SellerRequest{}).Where("status = ?", status).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	err := r.db.Preload("User").Preload("ReviewedBy").
		Where("status = ?", status).
		Limit(limit).Offset(offset).
		Order("created_at DESC").
		Find(&sellerRequests).Error
	return sellerRequests, total, err
}

func (r *SellerRequestRepository) Update(sellerRequest *model.SellerRequest) error {
	return r.db.Save(sellerRequest).Error
}

func (r *SellerRequestRepository) Delete(id uint) error {
	return r.db.Delete(&model.SellerRequest{}, id).Error
}
