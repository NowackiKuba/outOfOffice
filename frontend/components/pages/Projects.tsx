'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  Eye,
  File,
  Loader2,
  Settings,
  ShieldCheck,
  ShieldX,
  UserPlus,
} from 'lucide-react';
import Searchbar from '../Searchbar';
import FilterSelector from '../FilterSelector';
import CreateProjectDialog from '../dialogs/CreateProjectDialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjects, updateProject } from '@/actions/project.actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { TProject } from '@/types';
import UpdateProjectDialog from '../dialogs/UpdateProjectDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from '../ui/use-toast';
import ProjectDetailsDialog from '../dialogs/ProjectDetailsDialog';
import { formUrlQueryWithMultipleParams } from '@/lib/utils';
import ClearFilters from '../ClearFilters';

const Projects = ({ role }: { role: string }) => {
  const searchParams = useSearchParams();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<TProject>();
  const router = useRouter();
  const { data: projects, isLoading } = useQuery({
    queryKey: [
      'getProjects',
      { search: searchParams?.get('q') },
      { filter: searchParams?.get('status') },
      { sort: searchParams?.get('sort') },
      { dir: searchParams?.get('dir') },
    ],
    queryFn: async () =>
      await getProjects({
        search: searchParams.get('q') ? searchParams?.get('q')! : '',
        filter: searchParams?.get('status') ? searchParams?.get('status')! : '',
        sort: searchParams?.get('sort')
          ? searchParams?.get('sort')!
          : 'start_date',
        dir: searchParams?.get('dir') ? searchParams?.get('dir')! : 'asc',
      }),
  });
  const queryClient = useQueryClient();
  const { mutate: manageStatus, isPending } = useMutation({
    mutationKey: ['manageStatus'],
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProjects'],
        refetchType: 'all',
      });
      toast({
        title: 'Project status successfully changed',
        description: 'The project status has been changed successfully',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Error changing project stauts',
        description: 'There was an error chaning the project status',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });

  const handleSort = (keys: string[], values: string[]) => {
    const newUrl = formUrlQueryWithMultipleParams({
      keys: keys,
      params: searchParams.toString(),
      values: values,
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex flex-col gap-4 w-full'>
        <div className='flex items-center justify-between w-full'>
          <p className='text-3xl font-semibold'>Projects</p>
          {(role === 'admin' || role === 'pm') && (
            <Button
              onClick={() => {
                setIsOpenCreate(true);
              }}
              variant={'secondary'}
              className='flex items-center gap-2'
            >
              <UserPlus />
              <p>Create Project</p>
            </Button>
          )}
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Searchbar
            route='/projects'
            placeholder='Search for projects'
            iconPosition='left'
            otherClasses='xl:max-w-[440px] w-full rounded-md'
          />
          <FilterSelector
            queryKey='status'
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder='Filter by status'
            otherClassess='xl:max-w-[220px] max-w-[180px] py-[21px]'
          />
          {(searchParams?.get('status') ||
            searchParams?.get('sort') ||
            searchParams?.get('dir')) && (
            <ClearFilters
              keysToDelete={['status', 'sort', 'dir']}
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
      <div className='w-full md:flex hidden'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-[100px]'>ID</TableHead>
              <TableHead>Project Type</TableHead>
              <TableHead>Project Manager</TableHead>
              <TableHead>
                <div
                  onClick={() => {
                    handleSort(
                      ['sort', 'dir'],
                      [
                        'start_date',
                        !searchParams?.get('dir')
                          ? 'asc'
                          : searchParams?.get('dir') === 'asc'
                          ? 'desc'
                          : 'asc',
                      ]
                    );
                  }}
                  className='flex items-center justify-between cursor-pointer'
                >
                  Start Date
                  {searchParams?.get('sort') === 'start_date' && (
                    <>
                      {searchParams?.get('dir') === 'asc' ? (
                        <ArrowUp className='h-4 w-4' />
                      ) : (
                        <ArrowDown className='h-4 w-4' />
                      )}
                    </>
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div
                  onClick={() => {
                    handleSort(
                      ['sort', 'dir'],
                      [
                        'end_date',
                        !searchParams?.get('dir')
                          ? 'asc'
                          : searchParams?.get('dir') === 'asc'
                          ? 'desc'
                          : 'asc',
                      ]
                    );
                  }}
                  className='flex items-center justify-between cursor-pointer'
                >
                  End Date
                  {searchParams?.get('sort') === 'end_date' && (
                    <>
                      {searchParams?.get('dir') === 'asc' ? (
                        <ArrowUp className='h-4 w-4' />
                      ) : (
                        <ArrowDown className='h-4 w-4' />
                      )}
                    </>
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              {role.toLowerCase() !== 'employee' && (
                <TableHead className='text-right'>Options</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((p) => (
              <TableRow key={p.id} className='hover:bg-transparent'>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.project_type}</TableCell>
                <TableCell>{p.pm.full_name}</TableCell>
                <TableCell>{format(p.start_date, 'dd.MM.yyyy')}</TableCell>
                <TableCell>{format(p.end_date, 'dd.MM.yyyy')}</TableCell>

                <TableCell>
                  <div
                    className={`rounded-full text-center first-letter:uppercase font-[500] text-xs ${
                      p.status.toLowerCase() === 'active'
                        ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-200'
                        : 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-200'
                    } px-2 py-0.5`}
                  >
                    {p.status}
                  </div>
                </TableCell>
                {role.toLowerCase() !== 'employee' && (
                  <TableCell>
                    <div className='flex justify-end'>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button size={'icon'} variant={'ghost'}>
                            <Settings />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {(role === 'admin' ||
                            role === 'pm' ||
                            role === 'hr') && (
                            <DropdownMenuItem
                              className='flex gap-2 items-center cursor-pointer'
                              onClick={() => {
                                setSelectedProject(p);
                                setIsOpenDetails(true);
                              }}
                            >
                              <Eye className='h-4 w-4' />
                              <p>See Details</p>
                            </DropdownMenuItem>
                          )}
                          {(role === 'admin' || role === 'pm') && (
                            <DropdownMenuItem
                              className='flex gap-2 items-center cursor-pointer'
                              onClick={() => {
                                setSelectedProject(p);
                                setIsOpenUpdate(true);
                              }}
                            >
                              <Edit3 className='h-4 w-4' />
                              <p>Update</p>
                            </DropdownMenuItem>
                          )}
                          {(role === 'admin' || role === 'pm') && (
                            <DropdownMenuItem
                              onClick={() => {
                                manageStatus({
                                  endDate: p.end_date,
                                  id: p.id,
                                  projectType: p.project_type,
                                  startDate: p.start_date,
                                  status:
                                    p.status === 'active'
                                      ? 'inactive'
                                      : 'active',
                                  comment: p.comment,
                                });
                              }}
                              className='flex text-sm items-center gap-2 cursor-pointer'
                            >
                              {p.status === 'active' ? (
                                <>
                                  {isPending ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                  ) : (
                                    <ShieldX className='h-4 w-4' />
                                  )}
                                  <p>Deactivate</p>
                                </>
                              ) : (
                                <>
                                  {isPending ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                  ) : (
                                    <ShieldCheck className='h-4 w-4' />
                                  )}
                                  <p>Activate</p>
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='w-full flex items-center gap-2 flex-wrap md:hidden'>
        {projects?.map((p) => (
          <div
            key={p.id}
            className='bg-secondary rounded-xl sm:w-[calc(50vw-8px)] w-full p-2 flex items-center justify-between'
          >
            <div className='flex items-center gap-2 w-full'>
              <div className='flex items-center justify-center bg-primary/10 text-primary dark:bg-primary/20 dark:text-white text-2xl font-semibold h-16 w-16 rounded-md'>
                <File className='h-8 w-8' />
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-2.5 w-full'>
                  <p className='text-lg font-semibold'>{p.project_type}</p>
                  <div
                    className={`${
                      p.status.toLowerCase() === 'active'
                        ? 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-200'
                        : 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-200'
                    } px-2 py-1 rounded-full text-xs font-[500]`}
                  >
                    {p.status}
                  </div>
                </div>
                <p className='text-sm'>by {p.pm.full_name}</p>
              </div>
            </div>
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size={'icon'} variant={'ghost'}>
                    <Settings />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(role === 'admin' || role === 'pm') && (
                    <DropdownMenuItem
                      className='flex gap-2 items-center cursor-pointer'
                      onClick={() => {
                        setSelectedProject(p);
                        setIsOpenDetails(true);
                      }}
                    >
                      <Eye className='h-4 w-4' />
                      <p>See Details</p>
                    </DropdownMenuItem>
                  )}
                  {(role === 'admin' || role === 'pm') && (
                    <DropdownMenuItem
                      className='flex gap-2 items-center cursor-pointer'
                      onClick={() => {
                        setSelectedProject(p);
                        setIsOpenUpdate(true);
                      }}
                    >
                      <Edit3 className='h-4 w-4' />
                      <p>Update</p>
                    </DropdownMenuItem>
                  )}
                  {(role === 'admin' || role === 'pm') && (
                    <DropdownMenuItem
                      onClick={() => {
                        manageStatus({
                          endDate: p.end_date,
                          id: p.id,
                          projectType: p.project_type,
                          startDate: p.start_date,
                          status: p.status === 'active' ? 'inactive' : 'active',
                          comment: p.comment,
                        });
                      }}
                      className='flex text-sm items-center gap-2 cursor-pointer'
                    >
                      {p.status === 'active' ? (
                        <>
                          {isPending ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <ShieldX className='h-4 w-4' />
                          )}
                          <p>Deactivate</p>
                        </>
                      ) : (
                        <>
                          {isPending ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <ShieldCheck className='h-4 w-4' />
                          )}
                          <p>Activate</p>
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <CreateProjectDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
      {selectedProject && (
        <UpdateProjectDialog
          open={isOpenUpdate}
          setOpen={setIsOpenUpdate}
          project={selectedProject}
        />
      )}
      {selectedProject && (
        <ProjectDetailsDialog
          open={isOpenDetails}
          setOpen={setIsOpenDetails}
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default Projects;
