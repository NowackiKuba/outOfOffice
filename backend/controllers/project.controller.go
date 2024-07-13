package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/models"
)

func CreateProject() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var project models.Project

		err := ctx.ShouldBindJSON(&project)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		err = project.Create()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully created project"})
	}
}