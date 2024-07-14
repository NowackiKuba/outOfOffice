import React from 'react';
import NavLinks from './NavLinks';
import { getTokenValues } from '@/actions/auth.actions';

const Navbar = async () => {
  const data = await getTokenValues();
  return (
    <div className='flex items-center justify-between w-full py-2 border-b'>
      <p></p>
      <NavLinks role={data.role} />
      <p></p>
    </div>
  );
};

export default Navbar;
