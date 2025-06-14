
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import DialPad from '@/components/DialPad';
import StatsBar from '@/components/agent/StatsBar';
import CallLogs from '@/components/agent/CallLogs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useSip } from '@/providers/SipProvider';
import DispositionModal from '@/components/agent/DispositionModal';
import { useSessionTracker } from '@/hooks/useSessionTracker';
import LeadDetails from '@/components/agent/LeadDetails';
import AgentPerformance from '@/components/agent/AgentPerformance';
import { toast } from 'sonner';
import AgentConsoleHeader from '@/components/agent/AgentConsoleHeader';
import QuickActions from '@/components/agent/QuickActions';

export type Lead = Database['public']['Tables']['leads']['Row'];

const AgentConsole: React.FC = () => {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [simulatedCallDuration, setSimulatedCallDuration] = useState<number | undefined>(undefined);
  const [simulatedCallToastId, setSimulatedCallToastId] = useState<string | number | undefined>();
  const simCallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { setAudioElement } = useSip();
  const navigate = useNavigate();

  const { 
    isPaused, 
    togglePause, 
    endSession, 
    formattedCurrentSessionTime,
    formattedTotalBreakTime,
    formattedTotalSessionTime
  } = useSessionTracker();

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  useEffect(() => {
    return () => {
      if (simCallTimerRef.current) {
        clearInterval(simCallTimerRef.current);
      }
    };
  }, []);

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
      .channel('realtime-leads-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('Lead change received!', payload);
          
          const updatedLead = payload.new as Lead;

          // If the updated lead is the current one, refresh it
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

  const handleLeadAction = () => {
    queryClient.invalidateQueries({ queryKey: ['currentLead'] });
  };
  
  const handleEndSession = async () => {
    endSession();
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleSimulatedHangUp = () => {
    if (simCallTimerRef.current) {
      clearInterval(simCallTimerRef.current);
      simCallTimerRef.current = null;
    }
    setSimulatedCallDuration(undefined);
    if (simulatedCallToastId) {
      toast.dismiss(simulatedCallToastId);
      setSimulatedCallToastId(undefined);
    }
  };

  const simulateIncomingCall = () => {
    const toastId = toast(
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-500 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                <div>
                    <div className="font-semibold">Incoming Call</div>
                    <p className="text-sm text-muted-foreground">From: +1 (555) 123-4567 (Jane Doe)</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="sm" onClick={() => {
                    // Start timer
                    setSimulatedCallDuration(0);
                    if (simCallTimerRef.current) clearInterval(simCallTimerRef.current);
                    simCallTimerRef.current = setInterval(() => {
                      setSimulatedCallDuration(prev => (prev !== undefined ? prev + 1 : 0));
                    }, 1000);

                    // Update toast to "connected" state
                    toast.success(
                      <div className="font-semibold">Call answered (simulation)</div>,
                      {
                        id: toastId,
                        description: "You are now connected.",
                        duration: 3000,
                      }
                    );
                }}>Answer</Button>
                <Button size="sm" variant="destructive" onClick={() => {
                    toast.error("Call declined (simulation).", { duration: 2000 });
                    toast.dismiss(toastId);
                    setSimulatedCallToastId(undefined);
                }}>Decline</Button>
            </div>
        </div>, {
        duration: 15000,
        onDismiss: () => {
          if (simulatedCallToastId === toastId) {
              setSimulatedCallToastId(undefined);
          }
        },
    });
    setSimulatedCallToastId(toastId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <audio ref={audioRef} />
      <DispositionModal />
      <AgentConsoleHeader
        formattedCurrentSessionTime={formattedCurrentSessionTime}
        formattedTotalBreakTime={formattedTotalBreakTime}
        formattedTotalSessionTime={formattedTotalSessionTime}
        isPaused={isPaused}
        onEndSession={handleEndSession}
        onTogglePause={togglePause}
      />

      <StatsBar />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <LeadDetails lead={currentLead} isLoading={isLoadingLead} />
        </div>
        <div className="lg:col-span-1">
          <AgentPerformance />
        </div>
        <div className="lg:col-span-1">
          <CallLogs />
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full bg-green-950/20 backdrop-blur-md border-green-400/20 shadow-xl shadow-green-400/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dialer</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <DialPad lead={currentLead} simulatedDuration={simulatedCallDuration} onSimulatedHangUp={handleSimulatedHangUp} />
            </CardContent>
          </Card>
        </div>
      </div>

      <QuickActions
        currentLead={currentLead}
        onLeadAction={handleLeadAction}
        onSetCurrentLead={setCurrentLead}
        onSimulateIncomingCall={simulateIncomingCall}
      />
    </div>
  );
};

export default AgentConsole;
