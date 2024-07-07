import { FolderOpenDot, Users } from 'lucide-react';

export const navbarLinks = [
  {
    id: 1,
    name: 'Employees',
    path: '/employees',
    icon: Users,
    exact: true,
    roles: ['pm', 'hr', 'admin'],
  },
  {
    id: 2,
    name: 'Projects',
    path: '/projects',
    icon: FolderOpenDot,
    exact: true,
    roles: ['pm', 'hr', 'admin', 'employee'],
  },
  {
    id: 3,
    name: 'Leave Requests',
    path: '/leave-requests',
    icon: FolderOpenDot,
    exact: true,
    roles: ['pm', 'hr', 'admin', 'employee'],
  },
  {
    id: 4,
    name: 'Approval Requests',
    path: '/approval-requests',
    icon: FolderOpenDot,
    exact: true,
    roles: ['pm', 'hr', 'admin', 'employee'],
  },
];
