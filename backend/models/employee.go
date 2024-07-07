package models

import (
	"os"

	"out-of-office.com/outOfOffice/db"
)

type Employee struct { 
	ID int64 `json:"id"`
	FullName string `json:"full_name"`
	SubDivision string `json:"sub_division"`
	Position string `json:"position"`
	Role string `json:"role"`
	Status string `json:"status"`
	Partner int64 `json:"partner"`
	Balance int `json:"balance"`
	Photo *os.File `json:"photo"` 
}


func (e *Employee) Create() error { 
	query := `INSERT INTO employee(full_name, sub_division, position, role, status, partner, balance) VALUES(@p1, @p2, @p3, @p4, @p5, @p6, @p7)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(e.FullName, e.SubDivision, e.Position, e.Role, e.Status, e.Partner, e.Balance)

	return err
}


func GetEmployees() (*[]Employee, error) { 
	query := `SELECT * FROM employee`

	rows, err := db.DB.Query(query)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var employees []Employee

	for rows.Next() { 
		var employee Employee
		err := rows.Scan(
			&employee.ID,
			&employee.FullName,
			&employee.SubDivision,
			&employee.Position,
			&employee.Role,
			&employee.Status,
			&employee.Partner,
			&employee.Balance,
			&employee.Photo,
		)

		if err != nil { 
			return nil, err
		}

		employees = append(employees, employee)
	}

	if rows.Err() != nil { 
		return nil, err
	}

	return &employees, nil
}