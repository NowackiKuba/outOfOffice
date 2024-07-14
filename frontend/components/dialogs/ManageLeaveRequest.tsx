import { DialogProps, TLeaveRequest } from '@/types';
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
import { Textarea } from '../ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRequest } from '@/actions/leaveRequest.actions';

interface Props extends DialogProps {
  request: TLeaveRequest;
}

const ManageLeaveRequest = ({ open, setOpen, request }: Props) => {
  const [reason, setReason] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [updateType, setUpdateType] = useState<string>('');
  const queryClient = useQueryClient();
  const { mutate: manage, isPending } = useMutation({
    mutationKey: ['manageRequest'],
    mutationFn: updateRequest,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Request managed successfully',
        description: 'The request has been managed successfully',
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ['getApprovalRequests'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast({
        title: 'Error managing request',
        description: 'There was an error managing the request',
        duration: 1500,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setUpdateType('');
    },
  });

  useEffect(() => {
    if (!request) return;
    setReason(request.absence_reason);
    setStartDate(new Date(request.start_date));
    setEndDate(new Date(request.end_date));
  }, [request]);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full'>
        <p className='text-xl font-semibold'>Manage Request</p>
        <div className='flex flex-col gap-1 w-full'>
          <Label>Absence Reason</Label>
          <Textarea
            rows={8}
            className='resize-none'
            onChange={(e) => setReason(e.target.value)}
            defaultValue={reason}
            disabled={
              isPending ||
              request.status.toLowerCase() !== 'new' ||
              request.status.toLowerCase() !== 'submitted'
            }
          />
        </div>
        <div className='flex w-full items-center gap-2'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger
                asChild
                disabled={
                  isPending ||
                  request.status.toLowerCase() !== 'new' ||
                  request.status.toLowerCase() !== 'submitted'
                }
              >
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
                  disabled={
                    isPending ||
                    request.status.toLowerCase() !== 'new' ||
                    request.status.toLowerCase() !== 'submitted'
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger
                asChild
                disabled={
                  isPending ||
                  request.status.toLowerCase() !== 'new' ||
                  request.status.toLowerCase() !== 'submitted'
                }
              >
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={
                    isPending ||
                    request.status.toLowerCase() !== 'new' ||
                    request.status.toLowerCase() !== 'submitted'
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant={'destructive'}
            className='w-full'
            onClick={() => {
              setUpdateType('cancel');
              manage({
                endDate: endDate!,
                id: request.id,
                reason: reason,
                startDate: startDate!,
                status: 'Cancelled',
              });
            }}
            disabled={
              isPending ||
              request.status.toLowerCase() !== 'new' ||
              request.status.toLowerCase() !== 'submitted'
            }
          >
            {updateType === 'cancel' ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Cancel Request</p>
              </div>
            ) : (
              'Cancel Request'
            )}
          </Button>
          <Button
            className='w-full'
            onClick={() => {
              setUpdateType('update');
              manage({
                endDate: endDate!,
                id: request.id,
                reason: reason,
                startDate: startDate!,
                status: request.status,
              });
            }}
            disabled={
              isPending ||
              request.status.toLowerCase() !== 'new' ||
              request.status.toLowerCase() !== 'submitted'
            }
          >
            {updateType === 'update' ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Update Request</p>
              </div>
            ) : (
              'Update Request'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageLeaveRequest;
