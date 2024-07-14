import React from 'react';
import NavLinks from './NavLinks';
import { getTokenValues } from '@/actions/auth.actions';
import { ModeToggle } from './ModeToggle';
import MobileNav from './MobileNav';

const Navbar = async () => {
  const data = await getTokenValues();
  return (
    <div className='flex items-center justify-between w-full py-2 border-b px-3'>
      <p></p>
      <NavLinks role={data.role} />
      <div className='md:flex hidden'>
        <ModeToggle />
      </div>
      <div className='md:hidden flex'>
        <MobileNav />
      </div>
    </div>
  );
};

export default Navbar;
