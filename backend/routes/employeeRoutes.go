package routes

import (
	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/controllers"
)

func EmployeeRoutes(server *gin.Engine) { 
	server.POST("/employee", controllers.CreateEmployee())
	server.GET("/employees", controllers.GetCompanyEmployees())
}