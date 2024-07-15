import { DialogProps, TLeaveRequest } from '@/types';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { format, formatDistanceStrict } from 'date-fns';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { manageRequest } from '@/actions/approvalRequest.actions';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Drawer, DrawerContent } from '../ui/drawer';

interface Props extends DialogProps {
  request: TLeaveRequest;
  type?: string;
}

const RequestDetails = ({ open, setOpen, request, type }: Props) => {
  const isMobile = window.innerWidth < 768;
  const [comment, setComment] = useState<string | undefined>();
  const queryClient = useQueryClient();
  const { mutate: manage, isPending } = useMutation({
    mutationKey: ['manageRequest'],
    mutationFn: manageRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getApprovalRequests'],
        refetchType: 'all',
      });
      toast({
        title: 'Success',
        description: 'Request managed successfully',
        duration: 1500,
      });
      setComment(undefined);
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to manage request',
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
            <div className='flex items-start gap-2 w-full border-b pb-3'>
              <div className='h-24 w-24 rounded-lg bg-primary'></div>
              <div className='flex flex-col mt-2'>
                <p className='text-2xl font-semibold'>
                  Leave Request #{request.id}
                </p>
                <p className='text-gray-400'>
                  Sent by: {request.from.full_name}
                </p>
                <p className='text-gray-400'>
                  Days off balance: {request.from.balance}{' '}
                  {request.from.balance > 1 ? 'days' : 'day'}
                </p>
              </div>
            </div>
            <div className='flex flex-col py-3 border-b'>
              <p className='text-2xl font-semibold'>Requested Days</p>
              <p className='font-[500]'>
                {format(request.start_date, 'dd.MM.yyyy')} -{' '}
                {format(request.end_date, 'dd.MM.yyyy')} (
                {formatDistanceStrict(request.start_date, request.end_date)})
              </p>
            </div>
            <div className='flex flex-col py-3 border-b'>
              <p className='text-2xl font-semibold'>Reason</p>
              <p className='font-[500] italic'>{request.absence_reason}</p>
            </div>
            {type !== 'leave' && (
              <div className='flex items-center gap-2 w-full'>
                <Dialog>
                  <DialogTrigger
                    disabled={
                      isPending || request.status.toLowerCase() !== 'submitted'
                    }
                    className='w-full'
                  >
                    <Button
                      className='w-full'
                      variant={'outline'}
                      disabled={
                        isPending ||
                        request.status.toLowerCase() !== 'submitted'
                      }
                    >
                      Reject Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='flex flex-col gap-4 w-full max-w-xl'>
                    <p className='text-2xl font-semibold'>Add Comment</p>
                    <Textarea
                      rows={12}
                      className='resize-none'
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      className='w-full'
                      disabled={
                        isPending ||
                        request.status.toLowerCase() !== 'submitted'
                      }
                      onClick={() => {
                        manage({
                          id: request.id,
                          status: 'Rejected',
                          comment: comment,
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
                <Button
                  className='w-full'
                  disabled={
                    isPending || request.status.toLowerCase() !== 'submitted'
                  }
                  onClick={() => {
                    manage({
                      id: request.id,
                      status: 'Approved',
                    });
                  }}
                >
                  {isPending ? (
                    <div className='flex items-center gap-1'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <p>Approve Request</p>
                    </div>
                  ) : (
                    'Approve Request'
                  )}
                </Button>
              </div>
            )}
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
          <DialogContent className='flex flex-col gap-4 w-full max-w-2xl'>
            <div className='flex items-start gap-2 w-full border-b pb-3'>
              <div className='h-24 w-24 rounded-lg bg-primary'></div>
              <div className='flex flex-col mt-2'>
                <p className='text-2xl font-semibold'>
                  Leave Request #{request.id}
                </p>
                <p className='text-gray-400'>
                  Sent by: {request.from.full_name}
                </p>
                <p className='text-gray-400'>
                  Days off balance: {request.from.balance}{' '}
                  {request.from.balance > 1 ? 'days' : 'day'}
                </p>
              </div>
            </div>
            <div className='flex flex-col py-3 border-b'>
              <p className='text-2xl font-semibold'>Requested Days</p>
              <p className='font-[500]'>
                {format(request.start_date, 'dd.MM.yyyy')} -{' '}
                {format(request.end_date, 'dd.MM.yyyy')} (
                {formatDistanceStrict(request.start_date, request.end_date)})
              </p>
            </div>
            <div className='flex flex-col py-3 border-b'>
              <p className='text-2xl font-semibold'>Reason</p>
              <p className='font-[500] italic'>{request.absence_reason}</p>
            </div>
            {type !== 'leave' && (
              <div className='flex items-center gap-2 w-full'>
                <Dialog>
                  <DialogTrigger
                    disabled={
                      isPending || request.status.toLowerCase() !== 'submitted'
                    }
                    className='w-full'
                  >
                    <Button
                      className='w-full'
                      variant={'outline'}
                      disabled={
                        isPending ||
                        request.status.toLowerCase() !== 'submitted'
                      }
                    >
                      Reject Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='flex flex-col gap-4 w-full max-w-xl'>
                    <p className='text-2xl font-semibold'>Add Comment</p>
                    <Textarea
                      rows={12}
                      className='resize-none'
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      className='w-full'
                      disabled={
                        isPending ||
                        request.status.toLowerCase() !== 'submitted'
                      }
                      onClick={() => {
                        manage({
                          id: request.id,
                          status: 'Rejected',
                          comment: comment,
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
                <Button
                  className='w-full'
                  disabled={
                    isPending || request.status.toLowerCase() !== 'submitted'
                  }
                  onClick={() => {
                    manage({
                      id: request.id,
                      status: 'Approved',
                    });
                  }}
                >
                  {isPending ? (
                    <div className='flex items-center gap-1'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <p>Approve Request</p>
                    </div>
                  ) : (
                    'Approve Request'
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RequestDetails;
