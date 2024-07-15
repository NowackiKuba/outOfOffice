'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';
import { TProject } from '@/types';

export const createProject = async ({
  projectType,
  startDate,
  endDate,
  comment,
  status,
}: {
  projectType: string;
  startDate: Date;
  endDate: Date;
  comment?: string;
  status: string;
}) => {
  const { userId } = await getTokenValues();
  const res = await axios(`http://localhost:8080/project`, {
    method: 'POST',
    data: {
      project_type: projectType,
      start_date: startDate,
      end_date: endDate,
      comment,
      status,
      project_manager: userId,
    },
  });

  return res.data.message;
};

export const getProjects = async ({
  search,
  filter,
  dir,
  sort,
}: {
  search?: string;
  filter?: string;
  dir?: string;
  sort?: string;
}): Promise<TProject[]> => {
  const res = await axios(
    `http://localhost:8080/projects?search=${search}&filter=${filter}&sort=${sort}&dir=${dir}`,
    {
      method: 'GET',
    }
  );

  return res.data.projects;
};

export const updateProject = async ({
  projectType,
  startDate,
  endDate,
  comment,
  status,
  id,
}: {
  projectType: string;
  startDate: Date;
  endDate: Date;
  comment?: string;
  status: string;
  id: number;
}) => {
  const res = await axios(`http://localhost:8080/projects/${id}`, {
    method: 'PATCH',
    data: {
      project_type: projectType,
      start_date: startDate,
      end_date: endDate,
      comment,
      status,
    },
  });

  return res.data.message;
};

export const assignEmployeeToProject = async ({
  employeeId,
  projectId,
}: {
  employeeId: number;
  projectId: number;
}) => {
  const res = await axios(`http://localhost:8080/projects/assign-employee`, {
    method: 'POST',
    data: {
      employee_id: employeeId,
      project_id: projectId,
    },
  });
};
