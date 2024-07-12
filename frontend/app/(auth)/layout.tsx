import React, { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <main className='w-full h-screen'>{children}</main>;
};

export default AuthLayout;
