'use client';
import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useEmployee } from '@/hooks/useEmployee';
import { navbarLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const MobileNav = () => {
  const { employee, isLoading } = useEmployee({});
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <SheetTrigger asChild>
        <Button variant={'ghost'} onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className='flex items-center gap-2 w-full pb-3 border-b'>
          <div className='h-20 w-20 bg-primary/10 text-primary dark:bg-primary/20 text-white rounded-full flex items-center justify-center text-2xl font-semibold'>
            {employee?.full_name[0]}
            {employee?.full_name.split(' ')[1][0]}
          </div>
          <div className='flex flex-col'>
            <p className='text-2xl font-semibold'>{employee?.full_name}</p>
            <p className='text-lg font-normal'>{employee?.email}</p>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          {navbarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                onClick={() => {
                  setOpen(false);
                }}
                href={link.path}
                key={link.id}
                className={`${
                  pathname.startsWith(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 duration-100 ease-linear'
                } ${
                  link.requiredRoles.includes(employee?.role || '')
                    ? 'flex'
                    : 'hidden'
                } px-4 py-2 rounded-lg flex items-center gap-2`}
              >
                <Icon />
                <p>{link.name}</p>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
