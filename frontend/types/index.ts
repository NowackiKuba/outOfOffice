import { Dispatch, SetStateAction } from 'react';

export type TEmployee = Employee;
export type TApprovalRequest = ApprovalRequest;
export type TLeaveRequest = LeaveRequest;
export type TProject = Project;
export type TEmployeeProject = EmployeeProject;
interface Employee {
  id: number;
  full_name: string;
  email: string;
  password: string;
  sub_division: string;
  position: string;
  role: string;
  status: string;
  partner: number;
  balance: number;
  photo: any;
}

export interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface LeaveRequest {
  id: number;
  from: TEmployee;
  status: string;
  start_date: Date;
  end_date: Date;
  absence_reason: string;
  employee_id: number;
  comment: string;
}

interface ApprovalRequest {
  id: number;
  approver: TEmployee;
  status: string;
  date: string;
  reason: string;
  leave_request: LeaveRequest;
}

interface Project {
  id: number;
  project_type: string;
  start_date: Date;
  end_date: Date;
  comment: string;
  status: string;
  project_manager: number;
  pm: TEmployee;
}

interface EmployeeProject {
  id: number;
  employee_id: number;
  project_id: number;
  project: Project;
}
