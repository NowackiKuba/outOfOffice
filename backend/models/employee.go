package models

import (
	"errors"
	"os"

	"out-of-office.com/outOfOffice/db"
	"out-of-office.com/outOfOffice/utils"
)

type Employee struct { 
	ID int64 `json:"id"`
	FullName string `json:"full_name"`
	Email string `json:"email"`
	Password string `json:"password"`
	SubDivision string `json:"sub_division"`
	Position string `json:"position"`
	Role string `json:"role"`
	Status string `json:"status"`
	Partner int64 `json:"partner"`
	Balance int `json:"balance"`
	Photo *os.File `json:"photo"` 
}


func (e *Employee) Create() error { 
	query := `INSERT INTO employee(full_name, email, password, sub_division, position, role, status, partner, balance) VALUES(@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(e.Password)

	if err != nil { 
		return err
	}

	_, err = stmt.Exec(e.FullName, e.Email, hashedPassword, e.SubDivision, e.Position, e.Role, e.Status, e.Partner, e.Balance)

	return err
}


func GetEmployees(search string) (*[]Employee, error) { 
	query := `SELECT * FROM employee WHERE full_name LIKE @p1`

	likeParam := "%" + search + "%"

	rows, err := db.DB.Query(query, likeParam)

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
			&employee.Email,
			&employee.Password,
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

func (e *Employee) ValidateCredentials() error { 
	query := `SELECT id, password, role FROM employee WHERE email = @p1`

	row := db.DB.QueryRow(query, e.Email)

	var retrievedPassword string

	err := row.Scan(&e.ID, &retrievedPassword, &e.Role)

	if err != nil  {
		return err
	}

	passwordIsValid := utils.CheckPasswordHash(e.Password, retrievedPassword)

	if !passwordIsValid { 
		return errors.New("invalid credentials")
	}

	return nil
}


func (e *Employee) Update() error { 
	query := `UPDATE employee SET full_name = @p1, email = @p2, sub_division = @p3, position = @p4, partner = @p5, status = @p6 WHERE id = @p7`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(e.FullName, e.Email, e.SubDivision, e.Position, e.Partner, e.Status, e.ID)

	return err
}