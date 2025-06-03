package model

import (
	"time"

	"gorm.io/gorm"
)

type UserType string

const (
	UserTypeConsumer UserType = "consumer"
	UserTypeBusiness UserType = "business"
)

type User struct {
	gorm.Model
	Name     string   `json:"name"`
	Email    string   `json:"email" gorm:"uniqueIndex"`
	Password string   `json:"-"`
	UserType UserType `json:"user_type" gorm:"default:'consumer'"`
	Phone    string   `json:"phone"`
	Address  string   `json:"address"`
	Stores   []Store  `json:"stores,omitempty" gorm:"foreignKey:OwnerID"`
	Orders   []Order  `json:"orders,omitempty" gorm:"foreignKey:UserID"`
}

type UserInput struct {
	Name     string   `json:"name" binding:"required"`
	Email    string   `json:"email" binding:"required,email"`
	Password string   `json:"password" binding:"required,min=6"`
	UserType UserType `json:"user_type" binding:"required"`
	Phone    string   `json:"phone"`
	Address  string   `json:"address"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	User      UserDTO   `json:"user"`
}

type UserDTO struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	UserType  UserType  `json:"user_type"`
	Phone     string    `json:"phone"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (u *User) ToDTO() UserDTO {
	return UserDTO{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		UserType:  u.UserType,
		Phone:     u.Phone,
		Address:   u.Address,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}
