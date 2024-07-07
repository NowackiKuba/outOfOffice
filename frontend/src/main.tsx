import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Employees from './components/pages/Employees.tsx';
import Projects from './components/pages/Projects.tsx';
import ApprovalRequests from './components/pages/ApprovalRequests.tsx';
import LeaveRequests from './components/pages/LeaveRequests.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/employees',
    element: <Employees />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/approval-requests',
    element: <ApprovalRequests />,
  },
  {
    path: '/leave-requests',
    element: <LeaveRequests />,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
