import Navbar from '@/components/Navbar';
import React, { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='w-full h-screen'>
      <section className='w-full'>
        <Navbar />
      </section>
      <section className='w-full h-full max-h-[calc(100vh-140px)] xl:px-14 xl:py-4'>
        {children}
      </section>
    </main>
  );
};

export default MainLayout;
