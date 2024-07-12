'use client';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Props {
  placeholder: string;
  queryKey: string;
  options: FilterOptionProps[];
  otherClassess?: string;
}

interface FilterOptionProps {
  label: string;
  value: string;
}

const FilterSelector = ({
  queryKey,
  placeholder,
  options,
  otherClassess,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('');
  const handleFilter = (item: string) => {
    if (activeFilter === item) {
      setActiveFilter('');
      const newUrl = removeKeysFromQuery({
        keysToRemove: [queryKey],
        params: searchParams.toString(),
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActiveFilter(item);
      const newUrl = formUrlQuery({
        key: queryKey,
        value: item,
        params: searchParams.toString(),
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <Select onValueChange={(e) => handleFilter(e)}>
      <SelectTrigger className={otherClassess}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={index} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelector;
