
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Lead = Database['public']['Tables']['leads']['Row'];

export const useCurrentLead = () => {
    const [currentLead, setCurrentLead] = useState<Lead | null>(null);
    const queryClient = useQueryClient();

    const { data: lead, isLoading: isLoadingLead } = useQuery({
        queryKey: ['currentLead'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .or(`agent_id.eq.${user.id},agent_id.is.null`)
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) {
                console.error('Error fetching lead:', error);
                throw error;
            }
            return data;
        },
    });

    useEffect(() => {
        if (lead) {
            setCurrentLead(lead);
        }
    }, [lead]);

    // Realtime subscription for leads table
    useEffect(() => {
        const channel = supabase
            .channel('realtime-leads-channel-hook') // Unique channel name
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'leads' },
                (payload) => {
                    console.log('Lead change received in hook!', payload);

                    const updatedLead = payload.new as Lead;

                    if (updatedLead && updatedLead.id === currentLead?.id) {
                        setCurrentLead(updatedLead);
                    }

                    queryClient.invalidateQueries({ queryKey: ['currentLead'] });
                    queryClient.invalidateQueries({ queryKey: ['callLogs'] });
                    queryClient.invalidateQueries({ queryKey: ['agentLeadStats'] });
                    queryClient.invalidateQueries({ queryKey: ['agentWeeklyCallStats'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, currentLead]);
    
    return { currentLead, setCurrentLead, isLoadingLead };
};
