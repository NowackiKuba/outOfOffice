'use server';

import { TLeaveRequest } from '@/types';
import axios from 'axios';
import { getTokenValues } from './auth.actions';

export const getLeaveRequests = async ({
  search,
  filter,
}: {
  search?: string;
  filter?: string;
}): Promise<TLeaveRequest[]> => {
  const { userId, role } = await getTokenValues();
  const res = await axios(
    role === 'employee'
      ? `http://localhost:8080/leave-requests?search=${search}&filter=${filter}&employeeId=${userId}`
      : `http://localhost:8080/leave-requests?search=${search}&filter=${filter}`,
    {
      method: 'GET',
    }
  );

  return res.data.requests;
};

export const createLeaveRequest = async ({
  reason,
  startDate,
  endDate,
}: {
  reason: string;
  startDate: Date;
  endDate: Date;
}) => {
  const { userId } = await getTokenValues();

  const res = await axios('http://localhost:8080/leave-request', {
    method: 'POST',
    data: {
      absence_reason: reason,
      start_date: startDate,
      end_date: endDate,
      employee: userId,
      status: 'Submitted',
    },
  });

  return res.data.message;
};

export const updateRequest = async ({
  reason,
  startDate,
  endDate,
  id,
  status,
}: {
  reason: string;
  startDate: Date;
  endDate: Date;
  id: number;
  status: string;
}) => {
  const res = await axios(`http://localhost:8080/leave-request/${id}`, {
    method: 'PATCH',
    data: {
      absence_reason: reason,
      start_date: startDate,
      end_date: endDate,
      status: status,
    },
  });

  return res.data.message;
};
