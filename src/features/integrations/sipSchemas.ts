
import * as z from 'zod';

export const sipIntegrationSchema = z.object({
  sip_server_domain: z.string().min(1, 'SIP server domain is required'),
  sip_protocol: z.enum(['wss', 'ws', 'sip', 'pjsip'], {
    required_error: "You need to select a protocol.",
  }),
  sip_server_port: z.string().refine(val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0 && parseInt(val, 10) < 65536, {
    message: "Must be a valid port number",
  }),
  sip_username: z.string().optional(),
  sip_password: z.string().optional(),
  ami_host: z.string().optional(),
  ami_port: z.string().optional().refine(val => !val || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0 && parseInt(val, 10) < 65536), {
    message: "Must be a valid port number if provided",
  }),
  ami_user: z.string().optional(),
  ami_secret: z.string().optional(),
});

export type SipIntegrationFormData = z.infer<typeof sipIntegrationSchema>;
