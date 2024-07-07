package db

import (
	"database/sql"
	"fmt"

	_ "github.com/microsoft/go-mssqldb"
)


var DB *sql.DB

func Connect() { 

	var err error

	var server = "localhost"
	var port = 1433
	var user = "sa"
	var password = "Verystrongpassword@"
	var database = "master"

	connStr := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%d;database=%s", server, user, password, port, database)
	DB, err = sql.Open("sqlserver", connStr)

	if err != nil { 
		panic("Could not connect to db")
	}

	err = DB.Ping()

	if err != nil {
		fmt.Println(err) 
		panic("Could not ping db")
	}
	
}