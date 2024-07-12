package routes

import (
	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/controllers"
)

func AuthRoutes(server *gin.Engine) { 
	server.POST("/sign-in", controllers.SignIn())
	server.POST("/sign-up", controllers.SignUp())
}