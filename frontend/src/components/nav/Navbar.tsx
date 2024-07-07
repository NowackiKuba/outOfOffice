import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navbarLinks } from '../../constants';

const Navbar = () => {
  const { pathname } = useLocation();
  return (
    <div className='flex items-center justify-between w-full py-2 border-b'>
      <p></p>
      <div className='flex items-center gap-2'>
        {navbarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              to={link.path}
              key={link.id}
              className={`flex rounded-xl items-center gap-2 px-4 py-2 ${
                pathname === link.path
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-red-500/20 dark:hover:text-red-200 duration-100 ease-linear'
              }`}
            >
              <Icon className='w-5 h-5' />
              <p>{link.name}</p>
            </Link>
          );
        })}
      </div>
      <p></p>
    </div>
  );
};

export default Navbar;
