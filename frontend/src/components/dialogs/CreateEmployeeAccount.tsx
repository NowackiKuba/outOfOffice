import { DialogProps, TEmployee } from '../../types';
import { Dialog, DialogContent } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import employeeSchema from '../../lib/validation/employee.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import axios from 'axios';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface Props extends DialogProps {
  employees: TEmployee[];
}

const CreateEmployeeAccount = ({ open, setOpen, employees }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      full_name: '',
      sub_division: '',
      position: '',
      role: '',
      status: '',
      partner: '',
      balance: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof employeeSchema>) => {
    setIsLoading(true);
    try {
      const res = await axios('http://localhost:8080/employee', {
        method: 'POST',
        data: {
          full_name: values.full_name,
          sub_division: values.sub_division,
          position: values.position,
          role: values.role,
          status: values.status,
          partner: +values.partner,
          balance: +values.balance,
        },
      });

      if (res.status === 200) {
        setOpen(false);
      }
      toast({
        title: 'Successfully created employee account',
        duration: 2500,
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occured while creating employee account',
        variant: 'destructive',
        duration: 2500,
      });
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col w-full gap-4'>
        <p className='text-2xl font-semibold'>Create Employee Account</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col w-full gap-1.5'
          >
            <FormField
              control={form.control}
              name='full_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sub_division'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Division</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='admin'>Administrator</SelectItem>
                      <SelectItem value='hr'>HR</SelectItem>
                      <SelectItem value='pm'>Project Manager</SelectItem>
                      <SelectItem value='employee'>Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='partner'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>People Partner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Partner' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees?.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>
                          {e.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='balance'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>'Out of Office' Balance</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center w-full gap-2'>
              <Button
                variant={'p-outline'}
                className='w-full'
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <div className='flex items-center gap-1'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <p>Create</p>
                  </div>
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeAccount;
