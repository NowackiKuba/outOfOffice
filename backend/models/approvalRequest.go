package models

import (
	"fmt"

	"out-of-office.com/outOfOffice/db"
)

type ApprovalRequest struct { 
	ID int64 `json:"id"`
	ApproverId int64 `json:"approver_id"`
	LeaveRequest int64 `json:"leave_request_id"`
	Status string `json:"status"`
	Comment *string `json:"comment"`
	Approver Employee `json:"approver"`
	Request LeaveRequest `json:"leave_request"`
}


func (a *ApprovalRequest) Create() error { 
	query := `INSERT INTO approval_requests(approver, leave_request) VALUES(@p1, @p2)`

	stmt, err := db.DB.Prepare(query)

	if err  != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(a.ApproverId, a.LeaveRequest)

	return err
}

func GetApprovalRequests(search, filter string) (*[]ApprovalRequest, error) { 
	query := `SELECT ar.*, a.*, lr.*, f.* FROM approval_requests ar LEFT JOIN employee a ON a.id = ar.approver LEFT JOIN leave_requests lr ON ar.leave_request = lr.id LEFT JOIN employee f ON lr.employee = f.id WHERE ar.id LIKE '%' + @p1 + '%' AND ar.status LIKE '%' + @p2 + '%'`  

	rows, err := db.DB.Query(query, search, filter)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var approvalRequests []ApprovalRequest

	for rows.Next() { 
		var approvalRequest ApprovalRequest
		var approver Employee
		var leaveRequest LeaveRequest
		var from Employee

		err := rows.Scan(
			&approvalRequest.ID,
			&approvalRequest.ApproverId,
			&approvalRequest.LeaveRequest,
			&approvalRequest.Status,
			&approvalRequest.Comment,
			&approver.ID,
			&approver.FullName,
			&approver.Email,
			&approver.Password,
			&approver.SubDivision,
			&approver.Position,
			&approver.Role,
			&approver.Status,
			&approver.Partner,
			&approver.Balance,
			&approver.Photo,
			&leaveRequest.ID,
			&leaveRequest.EmployeeId,
			&leaveRequest.AbsenceReason,
			&leaveRequest.StartDate,
			&leaveRequest.EndDate,
			&leaveRequest.Comment,
			&leaveRequest.Status,
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
		approvalRequest.Approver = approver
		leaveRequest.Employee = from
		approvalRequest.Request = leaveRequest
		approvalRequests = append(approvalRequests, approvalRequest)
	}

	if rows.Err() != nil { 
		return nil, err
	}


	return &approvalRequests, nil


} 


func (a *ApprovalRequest) ManageRequest() error { 
	query := `UPDATE approval_requests SET status = @p1, comment = @p2 OUTPUT inserted.leave_request WHERE id = @p3 `

	var leaveRequestId int64

	err := db.DB.QueryRow(query, a.Status, a.Comment, a.ID).Scan(&leaveRequestId)

	if err != nil { 
		return err
	}

	leaveRequest, err := GetLeaveRequest(leaveRequestId)

	if err != nil { 
		return err
	}
	leaveRequest.Status = a.Status
	leaveRequest.Comment = a.Comment

	employeeId, err := leaveRequest.ManageRequest()

	if err != nil { 
		return err
	}

	if a.Status == "Approved" { 
		employee, err := GetEmployee(employeeId)
		if err != nil { 
			return err
		}
		difference := leaveRequest.EndDate.Sub(leaveRequest.StartDate) 
		newBalance := employee.Balance - int(difference.Hours()/24)
		
		employee.Balance = newBalance	
		fmt.Println(employee.Balance)


		err = employee.UpdateBalance()

		if err != nil { 
			return err
		}
	
		
	}


	return err

}