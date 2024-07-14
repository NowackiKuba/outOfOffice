import { DialogProps, TEmployee, TProject } from '@/types';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { getEmployeeProjects } from '@/actions/employee.actions';
import { ChevronRight, FolderRoot } from 'lucide-react';
import { format } from 'date-fns';
import ProjectDetailsDialog from './ProjectDetailsDialog';
import { Drawer, DrawerContent } from '../ui/drawer';

interface Props extends DialogProps {
  employee: TEmployee;
}

const EmployeeDetailsDialog = ({ employee, open, setOpen }: Props) => {
  const isMobile = window.innerWidth < 768;
  const [selectedProject, setSelectedProject] = useState<TProject>();
  const [isOpenProjectDetails, setIsOpenProjectDetails] =
    useState<boolean>(false);
  const { data: projects, isLoading } = useQuery({
    queryKey: ['getEmployeeProjects', { id: employee.id }],
    queryFn: async () => await getEmployeeProjects({ id: employee.id }),
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
          <DrawerContent className='flex flex-col w-full px-2 pb-2'>
            <div className='flex items-center gap-4 w-full py-3 border-b'>
              <div className='h-32 w-32 rounded-md bg-secondary'></div>
              <div className='flex flex-col'>
                <p className='text-2xl font-semibold'>{employee.full_name}</p>
                <p className='text-lg font-normal'>{employee.email}</p>
                <p className='text'>
                  Days off: {employee.balance}{' '}
                  {employee.balance > 1 ? 'days' : 'day'}
                </p>
              </div>
            </div>
            <div className='flex flex-col py-2 gap-4 w-full'>
              <p className='text-xl font-semibold'>Projects</p>
              {projects ? (
                <div className='flex flex-col gap-1 w-full'>
                  {projects.map((p) => (
                    <div
                      onClick={() => {
                        setSelectedProject(p.project);
                        setIsOpenProjectDetails(true);
                      }}
                      className='py-1.5 px-2 cursor-pointer group flex items-center justify-between w-full rounded-xl bg-secondary'
                      key={p.id}
                    >
                      <div className='flex items-center gap-2'>
                        <div className='h-16 w-16 rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-200 flex items-center justify-center'>
                          <FolderRoot className='h-7 w-7' />
                        </div>
                        <div className='flex flex-col'>
                          <p className='text-lg font-[500]'>
                            {p.project.project_type}
                          </p>
                          <p className='text-sm'>
                            {format(p.project.start_date, 'dd.MM.yyyy')} -{' '}
                            {format(p.project.end_date, 'dd.MM.yyyy')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className='h-5 w-5 group-hover:translate-x-1 duration-100 ease-linear' />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-xl font-semibold'>No data</p>
                  <p className='text-gray-400'>
                    This employees is not assigned to any project
                  </p>
                </div>
              )}
            </div>
            {selectedProject && (
              <ProjectDetailsDialog
                open={isOpenProjectDetails}
                setOpen={setIsOpenProjectDetails}
                project={selectedProject}
              />
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
          <DialogContent className='flex flex-col w-full'>
            <div className='flex items-center gap-4 w-full py-3 border-b'>
              <div className='h-32 w-32 rounded-md bg-secondary'></div>
              <div className='flex flex-col'>
                <p className='text-2xl font-semibold'>{employee.full_name}</p>
                <p className='text-lg font-normal'>{employee.email}</p>
                <p className='text'>
                  Days off: {employee.balance}{' '}
                  {employee.balance > 1 ? 'days' : 'day'}
                </p>
              </div>
            </div>
            <div className='flex flex-col py-2 gap-4 w-full'>
              <p className='text-xl font-semibold'>Projects</p>
              {projects ? (
                <div className='flex flex-col gap-1 w-full'>
                  {projects.map((p) => (
                    <div
                      onClick={() => {
                        setSelectedProject(p.project);
                        setIsOpenProjectDetails(true);
                      }}
                      className='py-1.5 px-2 cursor-pointer group flex items-center justify-between w-full rounded-xl bg-secondary'
                      key={p.id}
                    >
                      <div className='flex items-center gap-2'>
                        <div className='h-16 w-16 rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-200 flex items-center justify-center'>
                          <FolderRoot className='h-7 w-7' />
                        </div>
                        <div className='flex flex-col'>
                          <p className='text-lg font-[500]'>
                            {p.project.project_type}
                          </p>
                          <p className='text-sm'>
                            {format(p.project.start_date, 'dd.MM.yyyy')} -{' '}
                            {format(p.project.end_date, 'dd.MM.yyyy')}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className='h-5 w-5 group-hover:translate-x-1 duration-100 ease-linear' />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-xl font-semibold'>No data</p>
                  <p className='text-gray-400'>
                    This employees is not assigned to any project
                  </p>
                </div>
              )}
            </div>
            {selectedProject && (
              <ProjectDetailsDialog
                open={isOpenProjectDetails}
                setOpen={setIsOpenProjectDetails}
                project={selectedProject}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EmployeeDetailsDialog;
