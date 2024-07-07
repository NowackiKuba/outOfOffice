import z from 'zod';

const employeeSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: 'Full Name should contain at least 3 charachters' })
    .max(255, { message: 'Full Name should contain at most 255 charachters' }),
  sub_division: z
    .string()
    .min(3, { message: 'Sub Division should contain at least 3 charachters' }),
  position: z
    .string()
    .min(3, { message: 'Position should contain at least 3 charachters' }),
  role: z
    .string()
    .min(3, { message: 'Role should contain at least 3 charachters' }),
  status: z
    .string()
    .min(3, { message: 'Status should contain at least 3 charachters' }),
  partner: z.string().min(0, { message: 'Select Valid Partner' }),
  balance: z.string().min(0, { message: 'Balance should be greater than 0' }),
});

export default employeeSchema;
