'use client';

import { getCompanyEmployees } from '@/actions/employee.actions';
import { useQuery } from '@tanstack/react-query';

export const useEmployees = ({
  search,
  sort,
  filter,
  page,
  pageSize,
}: {
  search: string;
  sort?: string;
  filter?: string;
  page: number;
  pageSize: number;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: [
      'getEmployees',
      { search },
      { sort },
      { page },
      { pageSize },
      { filter },
    ],
    queryFn: async () =>
      await getCompanyEmployees({ search, sort, page, pageSize, filter }),
  });

  return { employees: data?.employees, isLoading, isNext: data?.isNext };
};
