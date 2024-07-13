import { getTokenValues } from '@/actions/auth.actions';
import Projects from '@/components/pages/Projects';
import React from 'react';

const page = async () => {
  const data = await getTokenValues();
  return (
    <div className='w-full'>
      <Projects role={data.role} />
    </div>
  );
};

export default page;
