export type TEmployee = {
  id: number;
  full_name: string;
  sub_division: string;
  position: string;
  role: string;
  status: string;
  partner: number;
  balance: number;
  photo: File;
};

export interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
