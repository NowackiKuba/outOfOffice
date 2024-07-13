package routes

import (
	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/controllers"
)

func ProjectRoutes(server *gin.Engine) { 
	server.POST("/project", controllers.CreateProject())
} 