
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CallContextType } from './useSipSession';

export const useSipDisposition = (callContext: CallContextType | null, onDispositionSuccess: () => void) => {
  const submitDisposition = useCallback(async ({ status, notes }: { status: string; notes: string }) => {
    if (!callContext) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast({ title: 'Error', description: 'User not authenticated.', variant: 'destructive' });
        return;
    }

    const duration = callContext.startTime ? Math.round((Date.now() - callContext.startTime) / 1000) : null;

    const { error } = await supabase.from('call_logs').insert({
        agent_id: user.id,
        lead_id: callContext.leadId,
        phone_number: callContext.phoneNumber,
        status: status as any,
        notes: notes || null,
        duration_seconds: duration,
    });

    if (error) {
        toast({ title: 'Failed to save disposition', description: error.message, variant: 'destructive' });
    } else {
        toast({ title: 'Disposition saved' });
        onDispositionSuccess();
    }
  }, [callContext, onDispositionSuccess]);

  return { submitDisposition };
};
