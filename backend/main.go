package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/db"
	"out-of-office.com/outOfOffice/routes"
)


func main() { 
	db.Connect()

	server := gin.Default()

	// server.Use(cors.New(cors.Config{
    //     AllowOrigins:     []string{"http://localhost:5173"}, // Allow the origin of your React app
    //     AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    //     AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
    //     ExposeHeaders:    []string{"Content-Length"},
    //     AllowCredentials: true,
    //     MaxAge:           12 * time.Hour,
    // }))
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowCredentials = true

	server.Use(cors.New(config))


	server.Use(gin.Logger())
	routes.EmployeeRoutes(server)
	routes.AuthRoutes(server)
	routes.LeaveRequestRoutes(server)
	routes.ApprovalRequestRoutes(server)
	routes.ProjectRoutes(server)

	server.Run(":8080")
}