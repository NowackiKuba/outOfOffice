'use server';

import axios from 'axios';
import { getTokenValues } from './auth.actions';

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
