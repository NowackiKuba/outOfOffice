import { z } from 'zod';

const employeeSchema = z.object({
  fullName: z
    .string()
    .min(3, {
      message: 'Employee full name should contain at least 3 characters',
    })
    .max(255, {
      message: 'Employee full name should contain at most 255 characters',
    }),
  password: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  position: z
    .string()
    .min(1, {
      message: 'Employee position should contain at least 1 characters',
    })
    .max(255, {
      message: 'Employee position should contain at most 255 characters',
    }),
  subDivision: z
    .string()
    .min(1, {
      message: 'Employee sub division should contain at least 1 characters',
    })
    .max(255, {
      message: 'Employee sub division should contain at most 255 characters',
    }),
  partner: z.string(),
});

export default employeeSchema;
