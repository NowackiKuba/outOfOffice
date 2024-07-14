import { DialogProps, TLeaveRequest } from '@/types';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { useMutation } from '@tanstack/react-query';
import { createLeaveRequest } from '@/actions/leaveRequest.actions';
import { toast } from '../ui/use-toast';
import { Drawer, DrawerContent } from '../ui/drawer';

interface Props extends DialogProps {
  type?: string;
  request: TLeaveRequest;
}

const CreateRequestDialog = ({ open, setOpen }: DialogProps) => {
  const isMobile = window.innerWidth < 768;
  const [reason, setReason] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { mutate: create, isPending } = useMutation({
    mutationKey: ['createLeaveRequest'],
    mutationFn: createLeaveRequest,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Leave request created successfully',
        description: 'The leave request has been created successfully',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error creating leave request',
        description: 'There was an error creating the leave request',
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
            <p className='text-xl font-semibold'>File leave request</p>
            <div className='flex flex-col gap-1 w-full'>
              <Label>Absence Reason</Label>
              <Textarea
                rows={8}
                className='resize-none'
                onChange={(e) => setReason(e.target.value)}
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
            <Button
              className='w-full'
              disabled={isPending}
              onClick={() => {
                create({
                  endDate: endDate!,
                  reason,
                  startDate: startDate!,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Submit</p>
                </div>
              ) : (
                'Submit'
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
            <p className='text-xl font-semibold'>File leave request</p>
            <div className='flex flex-col gap-1 w-full'>
              <Label>Absence Reason</Label>
              <Textarea
                rows={8}
                className='resize-none'
                onChange={(e) => setReason(e.target.value)}
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
            <Button
              className='w-full'
              disabled={isPending}
              onClick={() => {
                create({
                  endDate: endDate!,
                  reason,
                  startDate: startDate!,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Submit</p>
                </div>
              ) : (
                'Submit'
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CreateRequestDialog;
