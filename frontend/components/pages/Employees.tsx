'use client';
import { useEmployees } from '@/hooks/useEmployees';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  Edit3,
  Eye,
  File,
  Loader2,
  Settings,
  ShieldCheck,
  ShieldX,
  UserPlus,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Searchbar from '../Searchbar';
import UpdateEmployeeDialog from '../dialogs/ManageEmployeeDialog';
import { TEmployee } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployee } from '@/actions/employee.actions';
import { toast } from '../ui/use-toast';
import ManageEmployeeDialog from '../dialogs/ManageEmployeeDialog';
import FilterSelector from '../FilterSelector';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import AssignEmployeeToProjectDialog from '../dialogs/AssignEmployeeToProjectDialog';
import EmployeeDetailsDialog from '../dialogs/EmployeeDetailsDialog';

const Employees = ({ role }: { role: string }) => {
  const searchParams = useSearchParams();
  const { employees, isLoading } = useEmployees({
    search: searchParams?.get('q') ? searchParams?.get('q')! : '',
    sort: searchParams?.get('sort') ? searchParams?.get('sort')! : '',
  });

  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [type, setType] = useState<'update' | 'create'>();
  const [selectedEmployee, setSelectedEmployee] = useState<TEmployee>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeSort, setActiveSort] = useState<string>('');
  const handleSort = (item: string) => {
    if (activeSort === item) {
      setActiveSort('');
      const newUrl = removeKeysFromQuery({
        keysToRemove: ['sort'],
        params: searchParams.toString(),
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActiveSort(item);
      const newUrl = formUrlQuery({
        key: 'sort',
        value: item,
        params: searchParams.toString(),
      });

      router.push(newUrl, { scroll: false });
    }
  };

  const { mutate: deactivate, isPending } = useMutation({
    mutationKey: ['deactivateEmployee'],
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getEmployees'],
        refetchType: 'all',
      });
      toast({
        title: 'Success',
        description: 'Employee deactivated',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to deactivate employee',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex flex-col gap-4 w-full'>
        <div className='flex items-center justify-between w-full'>
          <p className='text-3xl font-semibold'>Employees</p>
          {(role === 'admin' || role === 'hr') && (
            <Button
              onClick={() => {
                setIsOpenUpdate(true);
                setType('create');
              }}
              variant={'secondary'}
              className='flex items-center gap-2'
            >
              <UserPlus />
              <p>Create Employee Account</p>
            </Button>
          )}
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Searchbar
            route='/employees'
            placeholder='Search for employees'
            iconPosition='left'
            otherClasses='xl:max-w-[440px] w-full rounded-md'
          />
          <FilterSelector
            queryKey='role'
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'employee', label: 'Employee' },
              { value: 'pm', label: 'Project Manager' },
              { value: 'hr', label: 'HR Manager' },
            ]}
            placeholder='Filter by role'
            otherClassess='xl:max-w-[220px] max-w-[180px] md:max-w-[200px] py-4'
          />
        </div>
      </div>
      <div className='md:flex hidden w-full'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-[100px]'>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>
                <div className='flex items-center justify-between cursor-pointer'>
                  Sub Division
                  {searchParams?.get('order_by') === 'sub_division' && (
                    <>
                      {searchParams?.get('dir') === 'asc' ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}
                    </>
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div
                  onClick={() => {
                    handleSort(
                      !searchParams?.get('sort')
                        ? 'asc'
                        : searchParams?.get('sort') === 'asc'
                        ? 'desc'
                        : 'asc'
                    );
                  }}
                  className='flex items-center justify-between cursor-pointer'
                >
                  Balance
                  {searchParams?.get('sort') === 'asc' ? (
                    <ArrowUp className='h-3 w-3' />
                  ) : (
                    <ArrowDown className='h-3 w-3' />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className='text-right'>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((e) => (
              <TableRow key={e.id} className='hover:bg-transparent'>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.full_name}</TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>{e.position}</TableCell>
                <TableCell>{e.sub_division}</TableCell>
                <TableCell>{e.balance}</TableCell>
                <TableCell>
                  <div
                    className={`rounded-full text-center first-letter:uppercase font-[500] text-xs ${
                      e.status.toLowerCase() === 'active'
                        ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-200'
                        : 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-200'
                    } px-2 py-0.5`}
                  >
                    {e.status}
                  </div>
                </TableCell>
                <TableCell>{e.role}</TableCell>
                <TableCell>
                  <div className='flex justify-end'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={'icon'} variant={'ghost'}>
                          <Settings />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {(role === 'admin' || role === 'hr') && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(e);
                              setIsOpenUpdate(true);
                              setType('update');
                            }}
                            className='flex text-sm items-center gap-2 cursor-pointer'
                          >
                            <Edit3 className='h-4 w-4' />
                            <p>Update</p>
                          </DropdownMenuItem>
                        )}
                        {(role === 'admin' || role === 'hr') && (
                          <DropdownMenuItem
                            onClick={() => {
                              deactivate({
                                email: e.email,
                                status:
                                  e.status === 'active' ? 'inactive' : 'active',
                                fullName: e.full_name,
                                id: e.id,
                                partner: e.partner,
                                position: e.position,
                                subDivision: e.sub_division,
                              });
                            }}
                            className='flex text-sm items-center gap-2 cursor-pointer'
                          >
                            {e.status === 'active' ? (
                              <>
                                {isPending ? (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                  <ShieldX className='h-4 w-4' />
                                )}
                                <p>Deactivate</p>
                              </>
                            ) : (
                              <>
                                {isPending ? (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                  <ShieldCheck className='h-4 w-4' />
                                )}
                                <p>Activate</p>
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        {(role === 'admin' || role === 'pm') && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(e);
                              setIsOpenDetails(true);
                            }}
                            className='flex items-center gap-2 cursor-pointer'
                          >
                            <Eye className='h-4 w-4' />
                            <p>See Details</p>
                          </DropdownMenuItem>
                        )}
                        {(role === 'admin' || role === 'pm') && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(e);
                              setIsOpenAssign(true);
                            }}
                            className='flex items-center gap-2 cursor-pointer'
                          >
                            <File className='h-4 w-4' />
                            <p>Assign to project</p>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center flex-wrap w-full gap-1 md:hidden sm:gap-2'>
        {employees?.map((e) => (
          <div
            key={e.id}
            className='sm:w-[calc(50%-8px)] w-full bg-secondary rounded-xl px-2 py-3 flex items-center justify-between'
          >
            <div className='flex items-center gap-2'>
              <div className='h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-primary dark:bg-primary/20 dark:text-blue-200 text-xl font-semibold'>
                {e.full_name[0]}
                {e.full_name.split(' ')[1][0]}
              </div>
              <div className='flex flex-col'>
                <p className='text-lg font-semibold'>{e.full_name}</p>
                <p>{e.email}</p>
              </div>
            </div>
            <div className='flex '>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size={'icon'} variant={'ghost'}>
                    <Settings />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(role === 'admin' || role === 'hr') && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedEmployee(e);
                        setIsOpenUpdate(true);
                        setType('update');
                      }}
                      className='flex text-sm items-center gap-2 cursor-pointer'
                    >
                      <Edit3 className='h-4 w-4' />
                      <p>Update</p>
                    </DropdownMenuItem>
                  )}
                  {(role === 'admin' || role === 'hr') && (
                    <DropdownMenuItem
                      onClick={() => {
                        deactivate({
                          email: e.email,
                          status: e.status === 'active' ? 'inactive' : 'active',
                          fullName: e.full_name,
                          id: e.id,
                          partner: e.partner,
                          position: e.position,
                          subDivision: e.sub_division,
                        });
                      }}
                      className='flex text-sm items-center gap-2 cursor-pointer'
                    >
                      {e.status === 'active' ? (
                        <>
                          {isPending ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <ShieldX className='h-4 w-4' />
                          )}
                          <p>Deactivate</p>
                        </>
                      ) : (
                        <>
                          {isPending ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <ShieldCheck className='h-4 w-4' />
                          )}
                          <p>Activate</p>
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  {(role === 'admin' || role === 'pm') && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedEmployee(e);
                        setIsOpenDetails(true);
                      }}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <Eye className='h-4 w-4' />
                      <p>See Details</p>
                    </DropdownMenuItem>
                  )}
                  {(role === 'admin' || role === 'pm') && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedEmployee(e);
                        setIsOpenAssign(true);
                      }}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <File className='h-4 w-4' />
                      <p>Assign to project</p>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <ManageEmployeeDialog
        open={isOpenUpdate}
        setOpen={setIsOpenUpdate}
        employee={selectedEmployee}
        managers={employees?.filter((e) => e.role === 'hr') || []}
        type={type!}
      />
      {selectedEmployee && (
        <AssignEmployeeToProjectDialog
          employee={selectedEmployee!}
          open={isOpenAssign}
          setOpen={setIsOpenAssign}
        />
      )}
      {selectedEmployee && (
        <EmployeeDetailsDialog
          employee={selectedEmployee}
          open={isOpenDetails}
          setOpen={setIsOpenDetails}
        />
      )}
    </div>
  );
};

export default Employees;
