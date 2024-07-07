package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/models"
)

func CreateEmployee() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var employee models.Employee

		err := ctx.ShouldBindJSON(&employee)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		err = employee.Create()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully created employee account"})
	}
}

func GetCompanyEmployees() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		employees, err := models.GetEmployees()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}
		fmt.Println(employees)
		ctx.JSON(http.StatusOK, gin.H{"employees": employees})
	}
}