package service

import (
	"github.com/sleeplessCoderrr/FoodVerse/internal/model"
	"github.com/sleeplessCoderrr/FoodVerse/internal/repository"
)

type AuthService struct {
	userRepo *repository.UserRepository
	jwtService *JWTService
}

func NewAuthService(userRepo *repository.UserRepository, jwtService *JWTService)*AuthService {
	return &AuthService{
		userRepo: 	userRepo,
		jwtService: jwtService,
	}
}

func (s *AuthService) Register(input *model.UserInput) (*model.AuthResponse, error){
	
}