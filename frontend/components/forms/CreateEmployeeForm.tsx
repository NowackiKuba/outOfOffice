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
import { createEmployee, updateEmployee } from '@/actions/employee.actions';
import { toast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const CreateEmployeeForm = ({
  managers,
  setOpen,
}: {
  managers: TEmployee[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    try {
      setIsLoading(true);
      const { email, fullName, partner, position, subDivision, password } =
        values;
      const res = await createEmployee({
        email: email,
        fullName: fullName,
        partner: parseInt(partner),
        position: position,
        subDivision: subDivision,
        status: 'active',
        balance: 20,
        password: password!,
        role: 'employee',
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
                  <Input {...field} />
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
                  <Input {...field} placeholder='johndoe@example.com' />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='password'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type='password' />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                <Select onValueChange={field.onChange}>
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
                <p>Create</p>
              </div>
            ) : (
              'Create'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CreateEmployeeForm;
