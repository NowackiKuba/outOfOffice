package routes

import (
	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/controllers"
)


func ApprovalRequestRoutes(server *gin.Engine) { 
	server.GET("/approval-requests", controllers.GetApprovalRequests())
	server.PATCH("/approval-requests/:id", controllers.ManageRequest())
}