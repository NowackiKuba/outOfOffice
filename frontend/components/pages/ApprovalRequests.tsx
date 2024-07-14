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
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { handleSort } from '@/lib/utils';
import ClearFilters from '../ClearFilters';

const ApprovalRequests = ({ role }: { role: string }) => {
  const router = useRouter();
  const [activeSort, setActiveSort] = useState<string>('');
  const searchParams = useSearchParams();
  const { data: approvalRequests, isLoading } = useQuery({
    queryKey: [
      'getApprovalRequests',
      { search: searchParams?.get('q') },
      { filter: searchParams?.get('status') },
    ],
    queryFn: async () =>
      await getApprovalRequests({
        search: searchParams.get('q') ? searchParams?.get('q')! : '',
        filter: searchParams.get('status') ? searchParams?.get('status')! : '',
      }),
  });
  const keysToDelete = [];
  if (searchParams?.get('sort')) {
    keysToDelete.push('sort');
  }

  if (searchParams?.get('status')) {
    keysToDelete.push('status');
  }
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<TLeaveRequest>();
  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex flex-col gap-4 w-full'>
        <p className='text-3xl font-semibold'>Approval Requests</p>
        <div className='flex items-center gap-2 w-full'>
          <Searchbar
            route='/approval-requests'
            placeholder='Search for approval requests'
            iconPosition='left'
            otherClasses='xl:max-w-[440px] rounded-md'
          />
          <FilterSelector
            queryKey='status'
            options={[
              { value: 'New', label: 'New' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
            placeholder='Filter by status'
            otherClassess='xl:max-w-[220px] py-4'
          />

          {(searchParams?.get('sort') || searchParams?.get('status')) && (
            <ClearFilters
              keysToDelete={keysToDelete}
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
      <div className='w-full'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-[100px]'>
                <div
                  onClick={() => {
                    handleSort(
                      !searchParams?.get('sort')
                        ? 'asc'
                        : searchParams?.get('sort') === 'asc'
                        ? 'desc'
                        : 'asc',
                      activeSort,
                      setActiveSort,
                      router,
                      searchParams
                    );
                  }}
                  className='flex items-center justify-between'
                >
                  <p>ID</p>
                  {searchParams?.get('sort') && (
                    <>
                      {searchParams?.get('sort') === 'asc' ? (
                        <ArrowUp className='h-4 w-4' />
                      ) : (
                        <ArrowDown className='h-4 w-4' />
                      )}
                    </>
                  )}
                </div>
              </TableHead>
              <TableHead>From</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalRequests?.map((r) => (
              <TableRow
                onClick={() => {
                  setSelectedRequest(r.leave_request);
                  setIsOpenDetails(true);
                }}
                key={r.id}
                className='cursor-pointer'
              >
                <TableCell>{r?.id}</TableCell>
                <TableCell>{r?.leave_request?.from?.full_name}</TableCell>
                <TableCell>{r?.approver?.full_name}</TableCell>
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
        />
      )}
    </div>
  );
};

export default ApprovalRequests;
