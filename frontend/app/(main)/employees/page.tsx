import { getTokenValues } from '@/actions/auth.actions';
import Employees from '@/components/pages/Employees';
import React from 'react';

const page = async () => {
  const data = await getTokenValues();
  return (
    <div className='w-full'>
      <Employees role={data.role} />
    </div>
  );
};

export default page;
