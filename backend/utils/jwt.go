package utils

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

const secretKey = "supersecert"

func GenerateToken(email, role string, userId int32) (string, error) { 
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"userId": userId,
		"role": role,
	
		"exp": 31557600000,
	})

	return token.SignedString([]byte(secretKey))
}

func VerifyToken(token string) (int64, error) { 
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok { 
			return 0, errors.New("unexpected signing method")
		}
		return []byte(secretKey), nil
	}, )

	if err != nil { 
		return 0, errors.New("could not parse token")
	}

	isTokenValid := parsedToken.Valid
	if !isTokenValid { 
		return 0, errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)

	if !ok { 
		return 0, errors.New("invalid token data")
	}

	// email := claims["email"].(string)
	userId := int64(claims["userId"].(float64))

	return userId, nil
}