'use client';
import { DialogProps } from '@/types';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { toast, useToast } from '../ui/use-toast';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/actions/project.actions';
import { Drawer, DrawerContent } from '../ui/drawer';

const CreateProjectDialog = ({ open, setOpen }: DialogProps) => {
  //   ProjectType
  // StartDate
  // EndDate
  // Comment
  // Status
  const isMobile = window.innerWidth < 768;
  const [projectType, setProjectType] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [comment, setComment] = useState<string | undefined>();
  const [status, setStatus] = useState<string>('');
  const queryClient = useQueryClient();
  const { mutate: create, isPending } = useMutation({
    mutationKey: ['createProject'],
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProjects'],
        refetchType: 'all',
      });
      setOpen(false);
      toast({
        title: 'Project created successfully',
        description: 'The project has been created successfully',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error creating project',
        description: 'There was an error creating the project',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  return (
    <>
      {isMobile ? (
        <Drawer
          open={open}
          onOpenChange={(v) => {
            if (!v) {
              setOpen(v);
            }
          }}
        >
          <DrawerContent className='flex flex-col gap-4 w-full px-2 pb-2'>
            <p className='text-xl font-semibold'>Create Project</p>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Project Type</Label>
              <Input onChange={(e) => setProjectType(e.target.value)} />
            </div>
            <div className='flex w-full items-center gap-2'>
              <div className='flex flex-col gap-0.5 w-full'>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {startDate ? (
                        format(startDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='flex flex-col gap-0.5 w-full'>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {endDate ? (
                        format(endDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Status</Label>
              <Select onValueChange={(e) => setStatus(e)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Project Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Comment (optional)</Label>
              <Textarea
                rows={6}
                className='resize-none'
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button
              className='w-full'
              disabled={isPending}
              onClick={() => {
                create({
                  comment,
                  endDate: endDate!,
                  startDate: startDate!,
                  projectType,
                  status,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Create</p>
                </div>
              ) : (
                'Create'
              )}
            </Button>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open={open}
          onOpenChange={(v) => {
            if (!v) {
              setOpen(v);
            }
          }}
        >
          <DialogContent className='flex flex-col gap-4 w-full'>
            <p className='text-xl font-semibold'>Create Project</p>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Project Type</Label>
              <Input onChange={(e) => setProjectType(e.target.value)} />
            </div>
            <div className='flex w-full items-center gap-2'>
              <div className='flex flex-col gap-0.5 w-full'>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {startDate ? (
                        format(startDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='flex flex-col gap-0.5 w-full'>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {endDate ? (
                        format(endDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Status</Label>
              <Select onValueChange={(e) => setStatus(e)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Project Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-0.5 w-full'>
              <Label>Comment (optional)</Label>
              <Textarea
                rows={6}
                className='resize-none'
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button
              className='w-full'
              disabled={isPending}
              onClick={() => {
                create({
                  comment,
                  endDate: endDate!,
                  startDate: startDate!,
                  projectType,
                  status,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Create</p>
                </div>
              ) : (
                'Create'
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CreateProjectDialog;
