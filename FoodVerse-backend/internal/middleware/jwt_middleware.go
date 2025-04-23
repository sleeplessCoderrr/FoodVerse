package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sleeplessCoderrr/FoodVerse/internal/service"
)

func JWTAuthMiddleware(jwtService *service.JWTService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header is missing",
			})
			ctx.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authorization header format",
			})
			ctx.Abort()
			return
		}

		claims, err := jwtService.ParseToken(parts[1])
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token",
			})
			ctx.Abort()
			return
		}

		ctx.Set("userId", claims.UserId)
		ctx.Next()
	}

}
