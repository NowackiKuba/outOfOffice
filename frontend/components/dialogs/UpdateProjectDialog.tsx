'use client';
import { DialogProps, TProject } from '@/types';
import React, { useEffect, useState } from 'react';
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
import { createProject, updateProject } from '@/actions/project.actions';
import { Drawer, DrawerContent } from '../ui/drawer';

interface Props extends DialogProps {
  project: TProject;
}

const UpdateProjectDialog = ({ open, setOpen, project }: Props) => {
  const isMobile = window.innerWidth < 768;
  //   ProjectType
  // StartDate
  // EndDate
  // Comment
  // Status
  const [projectType, setProjectType] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [comment, setComment] = useState<string | undefined>();
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (!project) return;
    setProjectType(project.project_type);
    setStartDate(new Date(project.start_date));
    setEndDate(new Date(project.end_date));
    setComment(project.comment);
    setStatus(project.status);
  }, [project]);
  const queryClient = useQueryClient();
  const { mutate: update, isPending } = useMutation({
    mutationKey: ['updateProject'],
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProjects'],
        refetchType: 'all',
      });
      setOpen(false);
      toast({
        title: 'Project updated successfully',
        description: 'The project has been updated successfully',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error updating project',
        description: 'There was an error updating the project',
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
              <Input
                defaultValue={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              />
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
              <Select defaultValue={status} onValueChange={(e) => setStatus(e)}>
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
                defaultValue={comment}
                rows={6}
                className='resize-none'
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button
              className='w-full'
              disabled={isPending}
              onClick={() => {
                update({
                  comment,
                  endDate: endDate!,
                  startDate: startDate!,
                  projectType,
                  status,
                  id: project.id,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Update</p>
                </div>
              ) : (
                'Update'
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
              <Input
                defaultValue={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              />
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
              <Select defaultValue={status} onValueChange={(e) => setStatus(e)}>
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
                defaultValue={comment}
                rows={6}
                className='resize-none'
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button
              className='w-full'
              disabled={isPending}
              onClick={() => {
                update({
                  comment,
                  endDate: endDate!,
                  startDate: startDate!,
                  projectType,
                  status,
                  id: project.id,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Update</p>
                </div>
              ) : (
                'Update'
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UpdateProjectDialog;
