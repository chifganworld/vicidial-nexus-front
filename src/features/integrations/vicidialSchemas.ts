
import * as z from 'zod';

export const vicidialIntegrationSchema = z.object({
  vicidial_domain: z.string().min(1, 'Vicidial domain is required').url('Must be a valid URL (e.g., https://example.com)'),
  api_user: z.string().min(1, 'API user is required'),
  api_password: z.string().min(1, 'API password is required'),
  ports: z.string().optional(),
});

export type VicidialIntegrationFormData = z.infer<typeof vicidialIntegrationSchema>;
