import { getTokenValues } from '@/actions/auth.actions';
import Employees from '@/components/pages/Employees';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const data = await getTokenValues();

  if (data.role === 'employee') {
    redirect('/projects');
  }
  return (
    <div className='w-full'>
      <Employees role={data.role} />
    </div>
  );
};

export default page;
