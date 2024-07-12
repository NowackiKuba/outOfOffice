package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/models"
	"out-of-office.com/outOfOffice/utils"
)


func SignUp() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var employee models.Employee

		err := ctx.ShouldBindJSON(&employee)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		err = employee.Create()

		if err != nil { 
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully signed up"})
	}
}

func SignIn() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var employee models.Employee

		err := ctx.ShouldBindJSON(&employee)

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		err = employee.ValidateCredentials()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
			return
		}

		token, err := utils.GenerateToken(employee.Email, employee.Role, int32(employee.ID))

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}



		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully signed in", "token": token})
	}
}
