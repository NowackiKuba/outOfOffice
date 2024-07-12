import { getTokenValues } from '@/actions/auth.actions';
import ApprovalRequests from '@/components/pages/ApprovalRequests';
import React from 'react';

const page = async () => {
  const data = await getTokenValues();
  return (
    <div className='w-full'>
      <ApprovalRequests role={data.role} />
    </div>
  );
};

export default page;
