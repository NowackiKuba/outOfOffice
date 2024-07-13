'use server';

import { TApprovalRequest } from '@/types';
import axios from 'axios';

export const getApprovalRequests = async ({
  search,
  filter,
}: {
  search?: string;
  filter?: string;
}): Promise<TApprovalRequest[]> => {
  const res = await axios(
    `http://localhost:8080/approval-requests?search=${search}&filter=${filter}`,
    {
      method: 'GET',
    }
  );

  return res.data.requests;
};

export const manageRequest = async ({
  status,
  comment,
  id,
}: {
  status: string;
  comment?: string;
  id: number;
}) => {
  const res = await axios(`http://localhost:8080/approval-requests/${id}`, {
    method: 'PATCH',
    data: {
      status,
      comment,
    },
  });

  return res.data.message;
};
