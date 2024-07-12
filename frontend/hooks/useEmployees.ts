'use client';

import { getCompanyEmployees } from '@/actions/employee.actions';
import { useQuery } from '@tanstack/react-query';

export const useEmployees = ({ search }: { search: string }) => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['getEmployees', { search }],
    queryFn: async () => await getCompanyEmployees({ search }),
  });

  return { employees, isLoading };
};
