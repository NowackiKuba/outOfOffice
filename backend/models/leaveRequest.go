package models

import (
	"time"

	"out-of-office.com/outOfOffice/db"
)

type LeaveRequest struct  {
	ID int64 `json:"id"`
	EmployeeId int64 `json:"employee"`
	AbsenceReason string `json:"absence_reason"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
	Comment *string `json:"comment"`
	Status string `json:"status"`
	Employee Employee `json:"from"`
}

func (l *LeaveRequest) Create() error {
	query := `INSERT INTO leave_requests(employee, absence_reason, start_date, end_date, comment) VALUES (@p1, @p2, @p3, @p4, @p5) SELECT SCOPE_IDENTITY() AS id`
	
	var requestId int64

	err := db.DB.QueryRow(query, l.EmployeeId, l.AbsenceReason, l.StartDate, l.EndDate, l.Comment).Scan(&requestId)
	if err != nil { 
		return err
	}
	var approvalRequest ApprovalRequest

	employee, err := GetEmployee(l.EmployeeId)

	if err != nil { 
		return err
	}

	approvalRequest.ApproverId = employee.Partner
	approvalRequest.LeaveRequest = requestId

	err = approvalRequest.Create()

	return err


}


func GetLeaveRequest(id int64) (*LeaveRequest, error) { 
	query := `SELECT * FROM leave_requests WHERE id = @p1`

	row := db.DB.QueryRow(query, id)

	var request LeaveRequest

	err := row.Scan(
		&request.ID,
		&request.EmployeeId,
		&request.AbsenceReason,
		&request.StartDate,
		&request.EndDate,
		&request.Comment,
		&request.Status,
	)

	return &request, err
}


func (l *LeaveRequest) ManageRequest() (int64, error) { 
	query := `UPDATE leave_requests SET status = @p1, comment = @p2 OUTPUT COALESCE(inserted.employee, 0) AS employee WHERE id = @p3`

	var employeeId int64

	err := db.DB.QueryRow(query, l.Status, l.Comment, l.ID).Scan(&employeeId)
	
	return employeeId, err


}

func GetLeaveRequests(search, filter string) (*[]LeaveRequest, error) { 
	query := `SELECT lr.*, f.* FROM leave_requests lr LEFT JOIN employee f ON lr.employee = f.id WHERE lr.id LIKE '%' + @p1 + '%' AND lr.status LIKE '%' + @p2 + '%'`

	rows, err := db.DB.Query(query, search, filter)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var requests []LeaveRequest

	for rows.Next() { 
		var request LeaveRequest
		var from Employee
		err := rows.Scan(
			&request.ID,
			&request.EmployeeId,
			&request.AbsenceReason,
			&request.StartDate,
			&request.EndDate,
			&request.Comment,
			&request.Status,
			&from.ID,
			&from.FullName,
			&from.Email,
			&from.Password,
			&from.SubDivision,
			&from.Position,
			&from.Role,
			&from.Status,
			&from.Partner,
			&from.Balance,
			&from.Photo,
		)

		if err != nil { 
			return nil, err
		}
		request.Employee = from
		requests = append(requests, request)
	}

	if rows.Err() != nil { 
		return nil, err
	}

	return &requests, nil
}