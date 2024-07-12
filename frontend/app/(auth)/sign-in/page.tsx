import SignInForm from '@/components/forms/SignInForm';
import React from 'react';

const page = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='w-[570px] py-2 px-8 rounded-xl bg-secondary flex flex-col items-center justify-start'>
        <SignInForm />
      </div>
    </div>
  );
};

export default page;
