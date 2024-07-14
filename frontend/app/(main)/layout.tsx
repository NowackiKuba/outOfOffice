import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='w-full h-screen'>
      <section className='w-full'>
        <Navbar />
      </section>
      <section className='w-full h-full max-h-[calc(100vh-140px)] sm:px-3 px-2 md:px-6 xl:px-14 sm:pb-0 pb-2 py-2 sm:py-4'>
        {children}
      </section>
    </main>
  );
};

export default MainLayout;
