
import * as z from 'zod';

export const remoteDbIntegrationSchema = z.object({
  host: z.string().min(1, 'Host is required'),
  port: z.string().refine(val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0 && parseInt(val, 10) < 65536, {
    message: "Must be a valid port number",
  }),
  db_name: z.string().min(1, 'Database name is required'),
  db_user: z.string().min(1, 'Database user is required'),
  db_password: z.string().min(1, 'Database password is required'),
});

export type RemoteDbIntegrationFormData = z.infer<typeof remoteDbIntegrationSchema>;
