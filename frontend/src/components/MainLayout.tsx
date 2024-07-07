import React, { ReactNode } from 'react';
import Navbar from './nav/Navbar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col w-full'>
      <Navbar />
      <div className='px-8 mt-8'>{children}</div>
    </div>
  );
};

export default Layout;
