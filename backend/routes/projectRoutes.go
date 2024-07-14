package routes

import (
	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/controllers"
)

func ProjectRoutes(server *gin.Engine) { 
	server.POST("/project", controllers.CreateProject())
	server.PATCH("/projects/:id", controllers.UpdateProject())
	server.POST("/projects/assign-employee", controllers.AssignEmployeeToProject())
	server.GET("/projects", controllers.GetProjects())
} 