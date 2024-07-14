'use server';

import { TEmployee, TEmployeeProject } from '@/types';
import axios from 'axios';
import { RedirectStatusCode } from 'next/dist/client/components/redirect-status-code';
import { getTokenValues } from './auth.actions';

export const getCompanyEmployees = async ({
  search,
  sort,
}: {
  search?: string;
  sort?: string;
}): Promise<TEmployee[]> => {
  const res = await axios(
    `http://localhost:8080/employees?search=${search}&sort=${sort}`,
    {
      method: 'GET',
    }
  );

  return res.data.employees;
};

export const createEmployee = async ({
  fullName,
  email,
  password,
  subDivision,
  position,
  role,
  status,
  partner,
  balance,
}: {
  fullName: string;
  email: string;
  password: string;
  subDivision: string;
  position: string;
  role: string;
  status: string;
  partner: number;
  balance: number;
}) => {
  const res = await axios('http://localhost:8080/sign-up', {
    method: 'POST',
    data: {
      full_name: fullName,
      email,
      password,
      sub_division: subDivision,
      position,
      role,
      status,
      partner,
      balance,
    },
  });

  return res.data.message;
};

export const updateEmployee = async ({
  fullName,
  email,
  status,
  position,
  partner,
  subDivision,
  id,
}: {
  fullName: string;
  email: string;
  status: string;
  position: string;
  partner: number;
  subDivision: string;
  id: number;
}) => {
  const res = await axios(`http://localhost:8080/employees/${id}`, {
    method: 'PATCH',
    data: {
      full_name: fullName,
      email,
      status,
      position,
      partner,
      sub_division: subDivision,
    },
  });

  return res.data.message;
};

export const getEmployeeProjects = async ({
  id,
}: {
  id: number;
}): Promise<TEmployeeProject[]> => {
  const res = await axios(`http://localhost:8080/employee/${id}/projects`, {
    method: 'GET',
  });

  return res.data.projects;
};

export const getEmployee = async ({
  id,
}: {
  id?: number;
}): Promise<TEmployee> => {
  let employeeId: number;
  if (!id) {
    const { userId } = await getTokenValues();
    employeeId = userId;
  } else {
    employeeId = id;
  }

  const res = await axios(`http://localhost:8080/employee/${employeeId}`, {
    method: 'GET',
  });

  return res.data.employee;
};
