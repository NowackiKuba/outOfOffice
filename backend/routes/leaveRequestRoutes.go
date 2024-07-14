package routes

import (
	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/controllers"
)

func LeaveRequestRoutes(server *gin.Engine) { 
	server.POST("/leave-request", controllers.CreateRequest())
	server.PATCH("/leave-request/:id", controllers.UpdateRequest())
	server.GET("/leave-requests", controllers.GetLeaveRequests())
}