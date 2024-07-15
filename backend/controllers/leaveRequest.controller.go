package controllers

import (
	"fmt"
	"net/http"
	"strconv"

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
		sort := ctx.Query("sort")		
		dir := ctx.Query("dir")		
		employeeId := ctx.Query("employeeId")	
	
		requests, err := models.GetLeaveRequests(search, filter, sort, dir, employeeId)

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"requests": requests})
	}
}


func UpdateRequest() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		var request models.LeaveRequest

		err = ctx.ShouldBindJSON(&request)

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		request.ID = id
		err = request.Update()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}


		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully updated request"})

	}
}