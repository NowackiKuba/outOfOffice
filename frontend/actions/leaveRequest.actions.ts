'use server';

import { TLeaveRequest } from '@/types';
import axios from 'axios';

export const getLeaveRequests = async ({
  search,
  filter,
}: {
  search?: string;
  filter?: string;
}): Promise<TLeaveRequest[]> => {
  const res = await axios(
    `http://localhost:8080/leave-requests?search=${search}&filter=${filter}`,
    {
      method: 'GET',
    }
  );

  return res.data.requests;
};
