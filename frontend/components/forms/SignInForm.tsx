'use client';
import signInSchema from '@/lib/validations/signIn.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
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
import { Button } from '../ui/button';
import { logIn } from '@/actions/auth.actions';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const onSubmit = async (formData: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      const res = await logIn(formData.email, formData.password);

      toast({
        title: 'Successfully logged in',
        description: 'You will be redirected to the dashboard',
        duration: 1500,
      });

      router.push('/employees');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log in',
        duration: 1500,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder='johndoe@example.com' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type='password' placeholder='••••••••' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' disabled={isLoading} type='submit'>
          {isLoading ? (
            <div className='flex items-center gap-1'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <p>{isLoading}</p>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
