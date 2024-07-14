'use client';

import { getCompanyEmployees } from '@/actions/employee.actions';
import { useQuery } from '@tanstack/react-query';

export const useEmployees = ({
  search,
  sort,
}: {
  search: string;
  sort?: string;
}) => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['getEmployees', { search }, { sort }],
    queryFn: async () => await getCompanyEmployees({ search, sort }),
  });

  return { employees, isLoading };
};
