package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/models"
)

func CreateProject() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var project models.Project

		err := ctx.ShouldBindJSON(&project)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		err = project.Create()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully created project"})
	}
}


func GetProjects() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		search := ctx.Query("search")
		filter := ctx.Query("filter")

		projects, err := models.GetProjects(search, filter)

		if err != nil  {
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"projects": projects})

	}
}


func UpdateProject() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		var project models.Project

		err = ctx.ShouldBindJSON(&project)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}
		project.ID = id
		err = project.Update()

		if err != nil { 
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return 
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully udpated project"})
	}
}


func AssignEmployeeToProject() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var employeeProject models.EmployeeProject

		err := ctx.ShouldBindJSON(&employeeProject)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		err = employeeProject.AssignEmployeeToProject()

		if err != nil { 
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return 
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully assigned employee to the project"})
	}
}


func GetEmployeeProjects() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return
		}

		projects, err := models.GetEmployeeProjects(id)

		if err != nil { 
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}


		ctx.JSON(http.StatusOK, gin.H{"projects": projects})
	}
}