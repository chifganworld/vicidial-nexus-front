
export type AuditLog = {
  id: number;
  created_at: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  details: Record<string, any> | null;
};
