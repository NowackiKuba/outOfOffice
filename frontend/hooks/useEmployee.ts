'use client';

import { getCompanyEmployees, getEmployee } from '@/actions/employee.actions';
import { useQuery } from '@tanstack/react-query';

export const useEmployee = ({ id }: { id?: number }) => {
  const { data: employee, isLoading } = useQuery({
    queryKey: ['getEmployee', { id }],
    queryFn: async () => await getEmployee({ id }),
  });

  return { employee, isLoading };
};
