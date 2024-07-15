package models

import (
	"fmt"
	"time"

	"out-of-office.com/outOfOffice/db"
)


type Project struct { 
	ID int64 `json:"id"`
	ProjectType string `json:"project_type"`
	StartDate string `json:"start_date"`
	EndDate string `json:"end_date"`
	ProjectManagerId int64 `json:"project_manager"`
	Comment *string `json:"comment"`
	Status string `json:"status"`
	ProjectManager Employee `json:"pm"`
}

type EmployeeProject struct { 
	ID int64 `json:"id"`
	ProjectId int64 `json:"project_id"`
	EmployeeId int64 `json:"employee_id"`
	Project Project `json:"project"`
}


func (p *Project) Create() error  {
	query := `INSERT INTO projects(project_type, start_date, end_date, project_manager, comment, status) VALUES(@p1, @p2, @p3, @p4, @p5, @p6)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	startDate, err := time.Parse(time.RFC3339, p.StartDate)

	if err != nil { 
		return err
	}

	endDate, err := time.Parse(time.RFC3339, p.EndDate)

	if err != nil { 
		return err
	}

	_, err = stmt.Exec(p.ProjectType, startDate, endDate, p.ProjectManagerId, p.Comment, p.Status)

	return err
}


func GetProjects(search, filter, dir, column string) (*[]Project, error) { 

	var orderByDirection string

	if dir == "asc" { 
		orderByDirection = "ASC"
	} else if dir == "desc" { 
		orderByDirection = "DESC"
	}

	query := fmt.Sprintf(`
    SELECT p.*, pm.*
    FROM projects p
    LEFT JOIN employee pm ON p.project_manager = pm.id
    WHERE p.id LIKE '%%%s%%' AND p.status LIKE '%%%s%%'
    ORDER BY %s %s
`, search, filter, column, orderByDirection)

	rows, err := db.DB.Query(query)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var projects []Project

	for rows.Next() { 
		var project Project
		var pm Employee

		err := rows.Scan(
			&project.ID,
			&project.ProjectType,
			&project.StartDate,
			&project.EndDate,
			&project.ProjectManagerId,
			&project.Comment,
			&project.Status,
			&pm.ID,
			&pm.FullName,
			&pm.Email,
			&pm.Password,
			&pm.SubDivision,
			&pm.Position,
			&pm.Role,
			&pm.Status,
			&pm.Partner,
			&pm.Balance,
			&pm.Photo,
		)

		if err != nil { 
			return nil, err
		}

		project.ProjectManager = pm
		projects = append(projects, project)
	}

	if rows.Err() != nil { 
		 return nil, err
	}

	return &projects, err
}

func (p *Project) Update() error { 
	query := `UPDATE projects SET project_type = @p1, start_date = @p2, end_date = @p3 ,comment = @p4, status = @p5 WHERE id = @p6`

	stmt ,err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(p.ProjectType, p.StartDate, p.EndDate, p.Comment, p.Status, p.ID)
	
	return err
}


func (ep *EmployeeProject) AssignEmployeeToProject() error { 
	query := `INSERT INTO employee_projects(project_id, employee_id) VALUES(@p1, @p2)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(ep.ProjectId, ep.EmployeeId)

	return err
}


func GetEmployeeProjects(id int64) (*[]EmployeeProject, error) { 


	query := `SELECT ep.*, p.* FROM employee_projects ep LEFT JOIN projects p ON ep.project_id = p.id WHERE ep.employee_id = @p1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil ,err
	}

	defer rows.Close()

	var projects []EmployeeProject

	for rows.Next() { 
		var employeeProject EmployeeProject
		var project Project

		err := rows.Scan(
			&employeeProject.ID,
			&employeeProject.ProjectId,
			&employeeProject.EmployeeId,
			&project.ID,
			&project.ProjectType,
			&project.StartDate,
			&project.EndDate,
			&project.ProjectManagerId,
			&project.Comment,
			&project.Status,
		)

		if err != nil { 
			return nil, err
		}
		employeeProject.Project = project
		projects = append(projects, employeeProject)
	}

	if rows.Err() != nil { 
		return nil, err
	}

	return &projects, nil
}