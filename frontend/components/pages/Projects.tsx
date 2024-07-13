'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
import Searchbar from '../Searchbar';
import FilterSelector from '../FilterSelector';
import CreateProjectDialog from '../dialogs/CreateProjectDialog';

const Projects = ({ role }: { role: string }) => {
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
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
            otherClasses='xl:max-w-[440px] rounded-md'
          />
          <FilterSelector
            queryKey='role'
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'employee', label: 'Employee' },
              { value: 'pm', label: 'Project Manager' },
              { value: 'hr', label: 'HR Manager' },
            ]}
            placeholder='Filter by role'
            otherClassess='xl:max-w-[220px] py-4'
          />
        </div>
      </div>
      <CreateProjectDialog open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default Projects;
