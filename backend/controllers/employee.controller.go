package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"out-of-office.com/outOfOffice/models"
)


func CreateEmployee() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		var employee models.Employee

		err := ctx.ShouldBindJSON(&employee)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		err = employee.Create()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully created employee account"})
	}
}

func GetCompanyEmployees() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		search := ctx.Query("search")
		sort := ctx.Query("sort")
		filter := ctx.Query("filter")

		page, err := strconv.ParseInt(ctx.Query("page"), 10, 64)
		
		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		pageSize, err := strconv.ParseInt(ctx.Query("pageSize"), 10, 64)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		employees, isNext, err := models.GetEmployees(search, filter, sort, pageSize, page)

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}
		fmt.Println(employees)
		ctx.JSON(http.StatusOK, gin.H{"employees": employees, "isNext": isNext})
	}
}





func UpdateEmployee() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		var employee models.Employee


		err = ctx.ShouldBindJSON(&employee)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		employee.ID = id

		err = employee.Update()

		if err != nil { 
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Successfully updated employee"})


	}
}


func GetEmployee() gin.HandlerFunc { 
	return func(ctx *gin.Context) {
		id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)

		if err != nil { 
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse incoming data"})
			return 
		}

		employee, err := models.GetEmployee(id)

		if err != nil { 
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"employee": employee})
	}
}