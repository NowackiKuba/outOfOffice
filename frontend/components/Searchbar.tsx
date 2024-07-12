'use client';
import { Input } from '@/components/ui/input';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface CustomInputProps {
  route?: string;
  iconPosition?: string;
  imgSrc?: string;
  placeholder: string;
  otherClasses?: string;
}

const Searchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');

  const [search, setSearch] = useState<string>(query || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['q'],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div
      className={`bg-secondary w-full dark:bg-secondary relative flex min-h-[44px] grow items-center gap-1 rounded-md px-4 ${otherClasses}`}
    >
      {iconPosition === 'left' && <Search />}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type='text'
        placeholder={placeholder}
        className='paragraph-regular focus-visible:ring-0 focus-visible:ring-offset-0 no-focus placeholder text-slate-400 border-none bg-transparent shadow-none outline-none'
      />
      {iconPosition === 'right' && <Search />}
    </div>
  );
};

export default Searchbar;
