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
import { getLeaveRequests } from '@/actions/leaveRequest.actions';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { ArrowDown, ArrowUp, File } from 'lucide-react';
import CreateRequestDialog from '../dialogs/CreateRequestDialog';
import ManageLeaveRequest from '../dialogs/ManageLeaveRequest';
import ClearFilters from '../ClearFilters';
import { formUrlQueryWithMultipleParams } from '@/lib/utils';
const LeaveRequests = ({ role }: { role: string }) => {
  const searchParams = useSearchParams();
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: [
      'getApprovalRequests',
      { search: searchParams?.get('q') },
      { filter: searchParams?.get('status') },
      { sort: searchParams?.get('sort') },
      { dir: searchParams?.get('dir') },
    ],
    queryFn: async () =>
      await getLeaveRequests({
        search: searchParams?.get('q') ? searchParams?.get('q')! : '',
        filter: searchParams?.get('status') ? searchParams?.get('status')! : '',
        dir: searchParams?.get('dir') ? searchParams?.get('dir')! : 'asc',
        sort: searchParams?.get('sort')
          ? searchParams?.get('sort')!
          : 'start_date',
      }),
  });

  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<TLeaveRequest>();

  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const router = useRouter();

  const handleSort = (keys: string[], values: string[]) => {
    const newUrl = formUrlQueryWithMultipleParams({
      keys: keys,
      params: searchParams.toString(),
      values: values,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex flex-col gap-4 w-full'>
        <div className='flex items-center justify-between w-full'>
          <p className='text-3xl font-semibold'>Leave Requests</p>
          {role === 'employee' && (
            <Button
              onClick={() => setIsOpenCreate(true)}
              className='flex items-center gap-2'
              variant={'secondary'}
            >
              <File />
              <p>File new request</p>
            </Button>
          )}
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Searchbar
            route='/leave-requests'
            placeholder='Search for leave requests'
            iconPosition='left'
            otherClasses='xl:max-w-[440px] w-full rounded-md'
          />
          <FilterSelector
            queryKey='status'
            options={[
              { value: 'New', label: 'New' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
              { value: 'Cancelled', label: 'Cancelled' },
              { value: 'Submitted', label: 'Submitted' },
            ]}
            placeholder='Filter by status'
            otherClassess='xl:max-w-[220px] w-[180px] py-[21px]'
          />
          {(searchParams?.get('status') ||
            searchParams?.get('sort') ||
            searchParams?.get('dir')) && (
            <ClearFilters
              keysToDelete={['status', 'sort', 'dir']}
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
      <div className='w-full md:flex hidden'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-[100px]'>ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>
                <div
                  onClick={() => {
                    handleSort(
                      ['sort', 'dir'],
                      [
                        'start_date',
                        !searchParams?.get('dir')
                          ? 'asc'
                          : searchParams?.get('dir') === 'asc'
                          ? 'desc'
                          : 'asc',
                      ]
                    );
                  }}
                  className='flex items-center justify-between cursor-pointer'
                >
                  Start Date
                  {searchParams?.get('sort') === 'start_date' && (
                    <>
                      {searchParams?.get('dir') === 'asc' ? (
                        <ArrowUp className='h-4 w-4' />
                      ) : (
                        <ArrowDown className='h-4 w-4' />
                      )}
                    </>
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div
                  onClick={() => {
                    handleSort(
                      ['sort', 'dir'],
                      [
                        'end_date',
                        !searchParams?.get('dir')
                          ? 'asc'
                          : searchParams?.get('dir') === 'asc'
                          ? 'desc'
                          : 'asc',
                      ]
                    );
                  }}
                  className='flex items-center justify-between cursor-pointer'
                >
                  End Date
                  {searchParams?.get('sort') === 'end_date' && (
                    <>
                      {searchParams?.get('dir') === 'asc' ? (
                        <ArrowUp className='h-4 w-4' />
                      ) : (
                        <ArrowDown className='h-4 w-4' />
                      )}
                    </>
                  )}
                </div>
              </TableHead>
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
                <TableCell>{r?.from?.full_name}</TableCell>
                <TableCell>
                  {format(r?.start_date || new Date(), 'dd.MM.yyyy')}
                </TableCell>
                <TableCell>
                  {format(r?.end_date || new Date(), 'dd.MM.yyyy')}
                </TableCell>
                <TableCell>
                  <div
                    className={`${
                      r.status.toLowerCase() === 'new'
                        ? 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-200'
                        : r.status.toLowerCase() === 'approved'
                        ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-200'
                        : r.status.toLowerCase() === 'submitted'
                        ? 'bg-sky-400/10 text-sky-400 dark:bg-sky-400/20 dark:text-sky-200'
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
      <div className='md:hidden flex items-center flex-wrap w-full  gap-2'>
        {leaveRequests?.map((r) => (
          <div
            onClick={() => {
              setSelectedRequest(r);
              setIsOpenDetails(true);
            }}
            key={r.id}
            className='sm:w-[calc(50%-8px)] w-full bg-secondary rounded-xl px-2 py-3 flex items-center justify-between'
          >
            <div className='flex items-center gap-2'>
              <div className='h-20 w-20 rounded-md bg-primary/10 text-primary dark:bg-primary/20 dark:text-white flex items-center justify-center'>
                <File className='h-10 w-10' />
              </div>
              <div className='flex flex-col gap-1.5'>
                <p className='text-lg font-semibold'>
                  {r?.from?.full_name}&apos;s Request
                </p>
                <p className='text-sm'>
                  {format(r?.start_date || new Date(), 'dd.MM.yyyy')} -{' '}
                  {format(r?.end_date || new Date(), 'dd.MM.yyyy')}
                </p>
                <div>
                  <div
                    className={`px-2 py-0.5 text-xs max-w-20 rounded-md font-semibold ${
                      r.status.toLowerCase() === 'new'
                        ? 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-200'
                        : r.status.toLowerCase() === 'cancelled' ||
                          r.status.toLowerCase() === 'rejected'
                        ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-200'
                        : 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-200'
                    }`}
                  >
                    <p className='first-letter:uppercase'>{r.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedRequest && role !== 'employee' && (
        <RequestDetails
          open={isOpenDetails}
          setOpen={setIsOpenDetails}
          request={selectedRequest}
          type='leave'
        />
      )}
      {selectedRequest && role === 'employee' && (
        <ManageLeaveRequest
          open={isOpenDetails}
          setOpen={setIsOpenDetails}
          request={selectedRequest}
        />
      )}

      <CreateRequestDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default LeaveRequests;
