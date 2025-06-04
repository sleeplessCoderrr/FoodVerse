package model

import (
	"time"

	"gorm.io/gorm"
)

type SellerRequestStatus string

const (
	SellerRequestStatusPending  SellerRequestStatus = "pending"
	SellerRequestStatusApproved SellerRequestStatus = "approved"
	SellerRequestStatusRejected SellerRequestStatus = "rejected"
)

type SellerRequest struct {
	gorm.Model
	UserID        uint                `json:"user_id" binding:"required"`
	User          User                `json:"user" gorm:"foreignKey:UserID"`
	IDNumber      string              `json:"id_number" binding:"required"`
	Reason        string              `json:"reason" binding:"required"`
	Location      string              `json:"location" binding:"required"`
	FaceImageURL  string              `json:"face_image_url" binding:"required"`
	Status        SellerRequestStatus `json:"status" gorm:"default:'pending'"`
	AdminComments string              `json:"admin_comments"`
	ReviewedByID  *uint               `json:"reviewed_by_id"`
	ReviewedBy    *User               `json:"reviewed_by,omitempty" gorm:"foreignKey:ReviewedByID"`
	ReviewedAt    *time.Time          `json:"reviewed_at"`
}

type SellerRequestInput struct {
	IDNumber     string `json:"id_number" binding:"required"`
	Reason       string `json:"reason" binding:"required"`
	Location     string `json:"location" binding:"required"`
	FaceImageURL string `json:"face_image_url" binding:"required"`
}

type SellerRequestUpdateInput struct {
	Status        SellerRequestStatus `json:"status" binding:"required"`
	AdminComments string              `json:"admin_comments"`
}

type SellerRequestResponse struct {
	ID            uint                `json:"id"`
	User          UserDTO             `json:"user"`
	IDNumber      string              `json:"id_number"`
	Reason        string              `json:"reason"`
	Location      string              `json:"location"`
	FaceImageURL  string              `json:"face_image_url"`
	Status        SellerRequestStatus `json:"status"`
	AdminComments string              `json:"admin_comments"`
	ReviewedBy    *UserDTO            `json:"reviewed_by,omitempty"`
	ReviewedAt    *time.Time          `json:"reviewed_at"`
	CreatedAt     time.Time           `json:"created_at"`
	UpdatedAt     time.Time           `json:"updated_at"`
}

func (sr *SellerRequest) ToResponse() SellerRequestResponse {
	response := SellerRequestResponse{
		ID:            sr.ID,
		User:          sr.User.ToDTO(),
		IDNumber:      sr.IDNumber,
		Reason:        sr.Reason,
		Location:      sr.Location,
		FaceImageURL:  sr.FaceImageURL,
		Status:        sr.Status,
		AdminComments: sr.AdminComments,
		ReviewedAt:    sr.ReviewedAt,
		CreatedAt:     sr.CreatedAt,
		UpdatedAt:     sr.UpdatedAt,
	}

	if sr.ReviewedBy != nil {
		reviewedByDTO := sr.ReviewedBy.ToDTO()
		response.ReviewedBy = &reviewedByDTO
	}

	return response
}
