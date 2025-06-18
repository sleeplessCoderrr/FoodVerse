package service

import (
	"errors"

	"github.com/FoodVerse/FoodVerse-backend/internal/model"
	"github.com/FoodVerse/FoodVerse-backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	userRepo   *repository.UserRepository
	jwtService *JWTService
}

func NewAuthService(userRepo *repository.UserRepository, jwtService *JWTService) *AuthService {
	return &AuthService{
		userRepo:   userRepo,
		jwtService: jwtService,
	}
}

func (s *AuthService) Register(input *model.UserInput) (*model.AuthResponse, error) {
	existingUser, err := s.userRepo.FindUserByEmail(input.Email)
	if err == nil && existingUser != nil {
		return nil, errors.New("user already exists")
	} else if err != nil && err != gorm.ErrRecordNotFound {
		return nil, err
	}

	hashhedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := &model.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashhedPassword),
		UserType: input.UserType,
		Phone:    input.Phone,
		Address:  input.Address,
	}

	if err := s.userRepo.CreateUser(user); err != nil {
		return nil, err
	}

	token, expiresAt, err := s.jwtService.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &model.AuthResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user.ToDTO(),
	}, nil
}

func (s *AuthService) Login(input *model.LoginInput) (*model.AuthResponse, error) {
	user, err := s.userRepo.FindUserByEmail(input.Email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("not found")
		}
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	token, expiresAt, err := s.jwtService.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &model.AuthResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user.ToDTO(),
	}, nil
}

func (s *AuthService) GetUserById(id uint) (*model.User, error) {
	return s.userRepo.FindUserById(id)
}

// Get all orders for a user (for stats)
func (s *AuthService) GetOrdersByUserId(userId uint) ([]model.Order, error) {
	return s.userRepo.GetOrdersByUserId(userId)
}
