'use client';
import { navbarLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavLinks = ({ role }: { role: string }) => {
  const pathname = usePathname();
  return (
    <div className='flex items-center gap-4'>
      {navbarLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            href={link.path}
            key={link.id}
            className={`${
              pathname.startsWith(link.path)
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 duration-100 ease-linear'
            } ${
              link.requiredRoles.includes(role) ? 'flex' : 'hidden'
            } px-4 py-2 rounded-lg flex items-center gap-2`}
          >
            <Icon />
            <p>{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;
