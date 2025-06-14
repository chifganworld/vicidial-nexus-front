
import * as z from 'zod';

export const sipTrunkSchema = z.object({
  id: z.string().uuid().optional(),
  trunk_name: z.string().min(2, 'Trunk name must be at least 2 characters.'),
  is_active: z.boolean().default(true),
  host: z.string().min(1, 'Host is required.'),
  port: z.coerce.number().int().min(1).max(65535).default(5060),
  protocol: z.enum(['udp', 'tcp', 'tls']).default('udp'),
  registration: z.enum(['none', 'user_pass']).default('none'),
  username: z.string().optional().nullable(),
  secret: z.string().optional().nullable(),
  dtmf_mode: z.enum(['rfc2833', 'inband', 'info', 'auto']).default('rfc2833'),
  nat: z.enum(['no', 'force_rport,comedia', 'yes']).default('yes'),
  qualify: z.boolean().default(true),
  insecure: z.array(z.enum(['port', 'invite'])).optional().nullable(),
  allow_codecs: z.array(z.string()).optional().nullable().default(['ulaw', 'alaw']),
  from_user: z.string().optional().nullable(),
  from_domain: z.string().optional().nullable(),
});

export type SipTrunk = z.infer<typeof sipTrunkSchema>;
