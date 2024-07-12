import { DialogProps, TEmployee } from '@/types';
import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import UpdateEmployeeForm from '../forms/UpdateEmployeeForm';
import { Button } from '../ui/button';
import CreateEmployeeForm from '../forms/CreateEmployeeForm';

interface Props extends DialogProps {
  employee?: TEmployee;
  managers: TEmployee[];
  type: 'update' | 'create';
}

const ManageEmployeeDialog = ({
  open,
  setOpen,
  employee,
  managers,
  type,
}: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-8 w-full'>
        <p className='text-xl font-semibold'>
          {type === 'update'
            ? `Update ${employee?.full_name}`
            : 'Create Employee Account'}
        </p>
        {type === 'update' ? (
          <UpdateEmployeeForm
            employee={employee!}
            managers={managers}
            setOpen={setOpen}
          />
        ) : (
          <CreateEmployeeForm managers={managers} setOpen={setOpen} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManageEmployeeDialog;
