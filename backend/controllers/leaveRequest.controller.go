package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/models"
)

func CreateRequest() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var leaveRequest models.LeaveRequest

		err := ctx.ShouldBindJSON(&leaveRequest)

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		err = leaveRequest.Create()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return 
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully created leave request"})
	}
}

func GetLeaveRequests() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		search := ctx.Query("search")		
		filter := ctx.Query("filter")			
		requests, err := models.GetLeaveRequests(search, filter)

		if err != nil { 
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"requests": requests})
	}
}