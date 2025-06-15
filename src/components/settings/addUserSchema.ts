
import * as z from 'zod';

const rolesEnum = z.enum(['agent', 'supervisor', 'admin']);

export const addUserFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  sipNumber: z.string().optional(),
  sipPassword: z.string().optional(),
  webrtcNumber: z.string().optional(),
  roles: z.array(rolesEnum).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one role.',
  }),
  group_ids: z.array(z.string()).optional(),
});

export type AddUserFormValues = z.infer<typeof addUserFormSchema>;
