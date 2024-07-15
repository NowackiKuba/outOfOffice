package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/models"
)


func GetApprovalRequests() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		search := ctx.Query("search")
		filter := ctx.Query("filter")
		sort := ctx.Query("sort")
		requests, err := models.GetApprovalRequests(search, filter, sort)

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return 
		}

		ctx.JSON(http.StatusOK, gin.H{"requests": requests})
	}
}

func ManageRequest() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		id, err := strconv.ParseInt(ctx.Param("id"),10, 64)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}


		var approvalRequest models.ApprovalRequest

		err = ctx.ShouldBindJSON(&approvalRequest)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		approvalRequest.ID = id
		err = approvalRequest.ManageRequest()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully managed request"})
	}
}