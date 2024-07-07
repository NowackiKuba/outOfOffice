import { useQuery } from '@tanstack/react-query';
import Layout from '../MainLayout';
import axios from 'axios';
import { TEmployee } from '../../types';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { ChevronDown, Settings, UserPlus } from 'lucide-react';
import { useState } from 'react';
import CreateEmployeeAccount from '../dialogs/CreateEmployeeAccount';

const fetchEmployees = async (): Promise<TEmployee[]> => {
  const res = await axios('http://localhost:8080/employees');

  return res.data.employees;
};
const Employees = () => {
  const { data: employees } = useQuery({
    queryKey: ['getCompanyEmployees'],
    queryFn: fetchEmployees,
  });
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  return (
    <Layout>
      <div className='flex flex-col w-full gap-4'>
        <div className='flex items-center justify-between w-full'>
          <p className='text-2xl font-semibold'>Employees</p>
          <Button
            className='flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <UserPlus />
            <p>Create Employee Account</p>
          </Button>
        </div>
        {employees?.length ? (
          <div className=''>
            <Table>
              <TableHeader>
                <TableRow className=''>
                  <TableHead>
                    <div className='flex items-center justify-between'>
                      <p>Full Name</p>
                      <ChevronDown className='w-4 h-4' />
                    </div>
                  </TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className='text-end'>Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.full_name}</TableCell>
                    <TableCell>{e.position}</TableCell>
                    <TableCell>{e.role}</TableCell>
                    <TableCell>
                      {e.status.toLowerCase() === 'active' ? (
                        <div className='px-2 py-1 text-xs font-[500] text-white bg-green-500 rounded-md w-14 flex items-center justify-center'>
                          Active
                        </div>
                      ) : (
                        <div className='px-2 py-1 text-xs font-[500] text-white bg-red-500 rounded-md w-14 flex items-center justify-center'>
                          Inactive
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{e.balance}</TableCell>
                    <TableCell className='flex justify-end'>
                      <Button size={'icon'} variant={'ghost'}>
                        <Settings />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center w-full h-full gap-8 mt-24'>
            <div className='flex flex-col'>
              <p className='text-xl font-semibold'>No employees to show</p>
              <p className='text-gray-400'>
                All company employees will show up here
              </p>
            </div>
            <Button>Create Employee Account</Button>
          </div>
        )}
      </div>
      <CreateEmployeeAccount
        open={isOpenCreate}
        setOpen={setIsOpenCreate}
        employees={employees!}
      />
    </Layout>
  );
};

export default Employees;
