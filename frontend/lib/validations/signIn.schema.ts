import z from 'zod';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

export default signInSchema;
