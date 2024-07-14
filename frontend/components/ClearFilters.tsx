import { removeKeysFromQuery } from '@/lib/utils';
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
interface Props {
  keysToDelete: string[];
  searchParams: ReadonlyURLSearchParams;
}

const ClearFilters = ({ keysToDelete, searchParams }: Props) => {
  const router = useRouter();
  const handleClear = () => {
    const newUrl = removeKeysFromQuery({
      keysToRemove: keysToDelete,
      params: searchParams.toString(),
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <Button
      variant={'destructive-ghost'}
      className='flex items-center gap-2'
      onClick={handleClear}
    >
      <Trash className='h-4 w-4' />
      <p>Remove Filters</p>
    </Button>
  );
};

export default ClearFilters;
