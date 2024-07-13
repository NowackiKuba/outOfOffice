package models

import (
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

	_, err = stmt.Exec(p.ProjectType, startDate, endDate, p.ProjectManagerId, p.Comment, p.StartDate)

	return err
}


func GetProjects() (*[]Project, error) { 
	query := `SELECT p.*, pm.* FROM projects p LEFT JOIN employee ON p.project_manager = pm.id`

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
			&project.ProjectManager,
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