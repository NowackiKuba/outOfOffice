'use client';
import React, { useState } from 'react';

import FilterSelector from '../FilterSelector';
import { useQuery } from '@tanstack/react-query';
import { getApprovalRequests } from '@/actions/approvalRequest.actions';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Searchbar from '../Searchbar';
import { TLeaveRequest } from '@/types';
import RequestDetails from '../dialogs/RequestDetails';
import { useSearchParams } from 'next/navigation';
import { getLeaveRequests } from '@/actions/leaveRequest.actions';
import { format } from 'date-fns';
const LeaveRequests = ({ role }: { role: string }) => {
  const searchParams = useSearchParams();
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: [
      'getApprovalRequests',
      { search: searchParams?.get('q') },
      { filter: searchParams?.get('status') },
    ],
    queryFn: async () =>
      await getLeaveRequests({
        search: searchParams?.get('q') ? searchParams?.get('q')! : '',
        filter: searchParams?.get('status') ? searchParams?.get('status')! : '',
      }),
  });

  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<TLeaveRequest>();
  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex flex-col gap-4 w-full'>
        <p className='text-3xl font-semibold'>Leave Requests</p>
        <div className='flex items-center gap-2 w-full'>
          <Searchbar
            route='/leave-requests'
            placeholder='Search for leave requests'
            iconPosition='left'
            otherClasses='xl:max-w-[440px] rounded-md'
          />
          <FilterSelector
            queryKey='status'
            options={[
              { value: 'New', label: 'New' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
            placeholder='Filter by status'
            otherClassess='xl:max-w-[220px] py-4'
          />
        </div>
      </div>
      <div className='w-full'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-[100px]'>ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests?.map((r) => (
              <TableRow
                onClick={() => {
                  setSelectedRequest(r);
                  setIsOpenDetails(true);
                }}
                key={r.id}
                className='cursor-pointer'
              >
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.from.full_name}</TableCell>
                <TableCell>{format(r.start_date, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{format(r.end_date, 'dd.MM.yyyy')}</TableCell>
                <TableCell>
                  <div
                    className={`${
                      r.status.toLowerCase() === 'new'
                        ? 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-200'
                        : r.status.toLowerCase() === 'approved'
                        ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-200'
                        : 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-200'
                    } rounded-md py-2 text-xs font-semibold  max-w-[100px] flex justify-center items-center`}
                  >
                    {r.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedRequest && (
        <RequestDetails
          open={isOpenDetails}
          setOpen={setIsOpenDetails}
          request={selectedRequest}
          type='leave'
        />
      )}
    </div>
  );
};

export default LeaveRequests;
