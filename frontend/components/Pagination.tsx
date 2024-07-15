import { cn, formUrlQuery } from '@/lib/utils';
import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  isNext: boolean;
  pageNumber: number;
  ohterClasses?: string;
}

const Pagination = ({ isNext, pageNumber, ohterClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: 'prev' | 'next') => {
    const nextPageNumber =
      direction === 'prev' ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      key: 'page',
      params: searchParams.toString(),
      value: nextPageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div
      className={cn('flex items-center justify-between w-full', ohterClasses)}
    >
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        size={'icon'}
        variant={'secondary'}
      >
        <ChevronLeft className='text-blue-500' />
      </Button>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
        size={'icon'}
        variant={'secondary'}
      >
        <ChevronRight className='text-blue-500' />
      </Button>
    </div>
  );
};

export default Pagination;
