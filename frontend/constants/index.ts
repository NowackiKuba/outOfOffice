import { Users } from 'lucide-react';
import path from 'path';

export const navbarLinks = [
  {
    id: 1,
    name: 'Employees',
    icon: Users,
    path: '/employees',
    requiredRoles: ['admin, hr, pm'],
  },
  {
    id: 2,
    name: 'Projects',
    icon: Users,
    path: '/projects',
    requiredRoles: ['admin, hr, pm'],
  },
  {
    id: 3,
    name: 'Leave Requests',
    icon: Users,
    path: '/leave-requests',
    requiredRoles: ['admin, hr, pm'],
  },
  {
    id: 4,
    name: 'Approval Requests',
    icon: Users,
    path: '/approval-requests',
    requiredRoles: ['admin, hr, pm'],
  },
];
