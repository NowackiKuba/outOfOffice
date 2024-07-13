import { getTokenValues } from '@/actions/auth.actions';
import LeaveRequests from '@/components/pages/LeaveRequests';
import React from 'react';

const page = async () => {
  const data = await getTokenValues();
  return (
    <div className='w-full'>
      <LeaveRequests role={data.role} />
    </div>
  );
};

export default page;
