import { DialogProps, TEmployee } from '@/types';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  assignEmployeeToProject,
  getProjects,
} from '@/actions/project.actions';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { Check, CircleCheck, Loader2 } from 'lucide-react';
import { getEmployeeProjects } from '@/actions/employee.actions';
import { Drawer, DrawerContent } from '../ui/drawer';

interface Props extends DialogProps {
  employee: TEmployee;
}

const AssignEmployeeToProjectDialog = ({ open, setOpen, employee }: Props) => {
  const isMobile = window.innerWidth < 768;
  const [selectedProject, setSelectedProject] = useState<number>();
  const { data: projects, isLoading } = useQuery({
    queryKey: ['getProjects'],
    queryFn: async () => await getProjects({ search: '', filter: '' }),
  });

  const { data: employeeProjects, isLoading: isLoadingEmployeeProjects } =
    useQuery({
      queryKey: ['getEmployeeProjects', { employeeId: employee.id }],
      queryFn: async () =>
        await getEmployeeProjects({
          id: employee?.id!,
        }),
    });

  const { mutate: assign, isPending } = useMutation({
    mutationKey: ['assignEmployeeToProject'],
    mutationFn: assignEmployeeToProject,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'Employee assigned to project',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error assigning employee to project',
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
          <DrawerContent className='flex flex-col gap-8 w-full max-w-2xl px-2 pb-2'>
            <div className='flex flex-col gap-2'>
              <p className='text-2xl font-semibold'>
                Assign {employee.full_name} To Project
              </p>
              <p className='text-gray-400'>Click on project below to assign</p>
            </div>
            <div className='flex items-center gap-2 flex-wrap w-full'>
              {projects?.map((project) => (
                <>
                  {employeeProjects?.find(
                    (ep) => ep.project_id === project.id
                  ) && (
                    <div className='h-48 w-48 absolute z-10 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-1'>
                      <CircleCheck className='text-green-500 h-10 w-10' />
                      <p className='text-sm text-center text-gray-200 font-[500]'>
                        Employee is already assigned to this project
                      </p>
                    </div>
                  )}
                  <div
                    onClick={() => {
                      if (
                        employeeProjects?.find(
                          (ep) => ep.project_id === project.id
                        )
                      ) {
                        return;
                      }
                      if (selectedProject === project.id) {
                        setSelectedProject(undefined);
                      } else {
                        setSelectedProject(project.id);
                      }
                    }}
                    key={project.id}
                    className={`${
                      selectedProject === project.id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }  h-48 w-48 cursor-pointer bg-secondary rounded-xl py-2 px-1.5 flex flex-col gap-1`}
                  >
                    <div className='flex items-center gap-2 w-full'>
                      <p className='text-lg font-[500]'>
                        {project.project_type}
                      </p>
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger>
                            <div
                              className={`${
                                project.status.toLowerCase() === 'active'
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              } h-3.5 w-3.5 rounded-full`}
                            />
                          </TooltipTrigger>
                          <TooltipContent className='first-letter:uppercase'>
                            Status: {project.status}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className='text-sm'>
                      {format(project.start_date, 'dd.MM.yyyy')} -{' '}
                      {format(project.end_date, 'dd.MM.yyyy')}
                    </p>
                  </div>
                </>
              ))}
            </div>
            <Button
              className='w-full mt-4'
              disabled={!selectedProject || isPending}
              onClick={() => {
                assign({
                  employeeId: employee.id,
                  projectId: selectedProject!,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Assign</p>
                </div>
              ) : (
                'Assign'
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
          <DialogContent className='flex flex-col gap-8 w-full max-w-2xl'>
            <div className='flex flex-col gap-2'>
              <p className='text-2xl font-semibold'>
                Assign {employee.full_name} To Project
              </p>
              <p className='text-gray-400'>Click on project below to assign</p>
            </div>
            <div className='flex items-center gap-2 flex-wrap w-full'>
              {projects?.map((project) => (
                <>
                  {employeeProjects?.find(
                    (ep) => ep.project_id === project.id
                  ) && (
                    <div className='h-48 w-48 absolute z-10 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-1'>
                      <CircleCheck className='text-green-500 h-10 w-10' />
                      <p className='text-sm text-center text-gray-200 font-[500]'>
                        Employee is already assigned to this project
                      </p>
                    </div>
                  )}
                  <div
                    onClick={() => {
                      if (
                        employeeProjects?.find(
                          (ep) => ep.project_id === project.id
                        )
                      ) {
                        return;
                      }
                      if (selectedProject === project.id) {
                        setSelectedProject(undefined);
                      } else {
                        setSelectedProject(project.id);
                      }
                    }}
                    key={project.id}
                    className={`${
                      selectedProject === project.id
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }  h-48 w-48 cursor-pointer bg-secondary rounded-xl py-2 px-1.5 flex flex-col gap-1`}
                  >
                    <div className='flex items-center gap-2 w-full'>
                      <p className='text-lg font-[500]'>
                        {project.project_type}
                      </p>
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger>
                            <div
                              className={`${
                                project.status.toLowerCase() === 'active'
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              } h-3.5 w-3.5 rounded-full`}
                            />
                          </TooltipTrigger>
                          <TooltipContent className='first-letter:uppercase'>
                            Status: {project.status}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className='text-sm'>
                      {format(project.start_date, 'dd.MM.yyyy')} -{' '}
                      {format(project.end_date, 'dd.MM.yyyy')}
                    </p>
                  </div>
                </>
              ))}
            </div>
            <Button
              className='w-full mt-4'
              disabled={!selectedProject || isPending}
              onClick={() => {
                assign({
                  employeeId: employee.id,
                  projectId: selectedProject!,
                });
              }}
            >
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Assign</p>
                </div>
              ) : (
                'Assign'
              )}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AssignEmployeeToProjectDialog;
