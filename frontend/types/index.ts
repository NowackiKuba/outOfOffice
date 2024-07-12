import { Dispatch, SetStateAction } from 'react';

export type TEmployee = Employee;

interface Employee {
  id: number;
  full_name: string;
  email: string;
  password: string;
  sub_division: string;
  position: string;
  role: string;
  status: string;
  partner: number;
  balance: number;
  photo: any;
}

export interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
