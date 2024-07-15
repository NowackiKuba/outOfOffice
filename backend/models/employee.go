package models

import (
	"errors"
	"fmt"
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


func GetEmployees(search, filter, sort string,  pageSize, page int64) (*[]Employee, bool, error) { 

	var sortDir string 

	if sort == "asc" { 
		sortDir = "ASC"
	} else if sort == "desc" { 
		sortDir = "DESC"
	}

	skipAmount := (page - 1) * pageSize


	query := `SELECT * FROM employee WHERE full_name LIKE @p1 AND role LIKE @p2 ORDER BY balance %s OFFSET @p3 ROWS FETCH NEXT @p4 ROWS ONLY`
	query = fmt.Sprintf(query, sortDir)

	fullNameParam := "%" + search + "%"
	roleParam := "%" + filter + "%"


	rows, err := db.DB.Query(query, fullNameParam, roleParam, skipAmount, pageSize)

	if err != nil { 
		return nil, false, err
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
			return nil, false, err
		}

		employees = append(employees, employee)
	}

	if rows.Err() != nil { 
		return nil, false, err
	}

	query = `SELECT COUNT(*) FROM employee`

	var totalEmployees int

	err = db.DB.QueryRow(query).Scan(&totalEmployees)
	fmt.Println(totalEmployees)

	isNext := totalEmployees > int(skipAmount) + len(employees)

	return &employees, isNext, err
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

func GetEmployee(id int64) (*Employee, error) { 
	query := `SELECT * FROM employee WHERE id = @p1`

	row := db.DB.QueryRow(query, id)

	var employee Employee

	err := row.Scan(
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

	return &employee, nil
}

func (e *Employee) UpdateBalance() error { 
	query := `UPDATE employee SET balance = @p1 WHERE id = @p2`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(e.Balance, e.ID)

	return err
}