'use client';
import employeeSchema from '@/lib/validations/employee.schema';
import { TEmployee } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { updateEmployee } from '@/actions/employee.actions';
import { toast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const UpdateEmployeeForm = ({
  employee,
  managers,
  setOpen,
}: {
  employee: TEmployee;
  managers: TEmployee[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: employee.full_name,
      email: employee.email,
      position: employee.position,
      subDivision: employee.sub_division,
      partner: employee.partner.toString(),
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    try {
      setIsLoading(true);
      const { email, fullName, partner, position, subDivision } = values;
      const res = await updateEmployee({
        email: email ? email : employee.email,
        fullName: fullName ? fullName : employee.full_name,
        partner: partner ? parseInt(partner) : employee.partner,
        position: position ? position : employee.position,
        subDivision: subDivision ? subDivision : employee.sub_division,
        id: employee.id,
        status: employee.status,
      });

      toast({
        title: 'Success',
        description: res,
        duration: 1500,
      });
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['getEmployees'],
        refetchType: 'all',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update employee',
        duration: 1500,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            name='fullName'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={field.value} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='email'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    defaultValue={field.value}
                    placeholder='johndoe@example.com'
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='position'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={field.value} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='subDivision'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Division</FormLabel>
                <FormControl>
                  <Input {...field} defaultValue={field.value} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='partner'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select employee partner' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {managers.map((m) => (
                      <SelectItem value={m.id.toString()} key={m.id}>
                        {m.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full mt-4' type='submit' disabled={isLoading}>
            {isLoading ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Update</p>
              </div>
            ) : (
              'Update'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UpdateEmployeeForm;
