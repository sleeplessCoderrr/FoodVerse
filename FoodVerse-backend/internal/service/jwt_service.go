package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService struct {
	secretKey       string
	expirationHours int
}

type JWTClaims struct {
	UserId uint `json:"user_id"`
	jwt.RegisteredClaims
}

func NewJWTService(secretkey string, expirationHours int) *JWTService {
	return &JWTService{
		secretKey:       secretkey,
		expirationHours: expirationHours,
	}
}

func (s *JWTService) GenerateToken(userId uint) (string, time.Time, error) {
	expirationTime := time.Now().Add(time.Duration(s.expirationHours) * time.Hour)

	claims := &JWTClaims{
		UserId: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.secretKey))

	return tokenString, expirationTime, err
}

func (s *JWTService) ParseToken(tokenString string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&JWTClaims{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(s.secretKey), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
