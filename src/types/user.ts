
export type UserRole = 'agent' | 'supervisor' | 'admin';

export type User = {
  id: string;
  full_name: string | null;
  email: string | null;
  roles: UserRole[];
  groups: string[] | null;
  sip_number: string | null;
  webrtc_number: string | null;
  sip_password: string | null;
};
