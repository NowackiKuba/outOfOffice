import { DialogProps, TProject } from '@/types';
import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { CalendarMinus, CalendarPlus } from 'lucide-react';
import { format } from 'date-fns';
import { Drawer, DrawerContent } from '../ui/drawer';

interface Props extends DialogProps {
  project: TProject;
}

const ProjectDetailsDialog = ({ open, setOpen, project }: Props) => {
  const isMobile = window.innerWidth < 768;
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
          <DrawerContent className='flex flex-col w-full pb-2 px-2 pb-2'>
            <div className='flex flex-col pb-2 border-b'>
              <div className='flex items-center gap-2'>
                <p className='text-2xl font-semibold'>{project.project_type}</p>
                <div
                  className={`${
                    project.status.toLowerCase() === 'active'
                      ? 'bg-green-500/20 text-green-500 dark:text-green-200 dark:bg-green-500/20'
                      : 'bg-red-500/10 text-red-500 dark:text-red-200 dark:bg-red-500/20'
                  } px-3 py-1.5 text-xs rounded-full first-letter:uppercase`}
                >
                  {project.status}
                </div>
              </div>
              <p className='font-[500]'>by {project.pm.full_name}</p>
            </div>
            <div className='pb-2 border-b w-full flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-2 w-full'>
                <CalendarPlus className='h-5 w-5' />
                <p className='font-[500]'>
                  {format(project.start_date, 'dd.MM.yyyy')}
                </p>
              </div>
              <div className='flex items-center gap-2 w-full'>
                <CalendarMinus className='h-5 w-5' />
                <p className='font-[500]'>
                  {format(project.end_date, 'dd.MM.yyyy')}
                </p>
              </div>
            </div>
            <div className='w-full flex flex-col gap-2 py-2'>
              <p className='text-xl font-semibold'>Comment</p>
              {project?.comment ? (
                <p className='italic'>{project.comment}</p>
              ) : (
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-lg font-[500]'>
                    This project has not comment
                  </p>
                </div>
              )}
            </div>
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
          <DialogContent className='flex flex-col w-full'>
            <div className='flex flex-col pb-2 border-b'>
              <div className='flex items-center gap-2'>
                <p className='text-2xl font-semibold'>{project.project_type}</p>
                <div
                  className={`${
                    project.status.toLowerCase() === 'active'
                      ? 'bg-green-500/20 text-green-500 dark:text-green-200 dark:bg-green-500/20'
                      : 'bg-red-500/10 text-red-500 dark:text-red-200 dark:bg-red-500/20'
                  } px-3 py-1.5 text-xs rounded-full first-letter:uppercase`}
                >
                  {project.status}
                </div>
              </div>
              <p className='font-[500]'>by {project.pm.full_name}</p>
            </div>
            <div className='pb-2 border-b w-full flex flex-col gap-2'>
              <div className='flex items-center gap-2 w-full'>
                <CalendarPlus className='h-5 w-5' />
                <p className='font-[500]'>
                  {format(project.start_date, 'dd.MM.yyyy')}
                </p>
              </div>
              <div className='flex items-center gap-2 w-full'>
                <CalendarMinus className='h-5 w-5' />
                <p className='font-[500]'>
                  {format(project.end_date, 'dd.MM.yyyy')}
                </p>
              </div>
            </div>
            <div className='w-full flex flex-col gap-2'>
              <p className='text-xl font-semibold'>Comment</p>
              {project?.comment ? (
                <p className='italic'>{project.comment}</p>
              ) : (
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-lg font-[500]'>
                    This project has not comment
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProjectDetailsDialog;
