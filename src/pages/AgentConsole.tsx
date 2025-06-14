
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Pause, PhoneOff } from 'lucide-react';
import DialPad from '@/components/DialPad';
import AddLeadModal from '@/components/AddLeadModal';
import UpdateLeadModal from '@/components/UpdateLeadModal';
import SearchLeadModal from '@/components/SearchLeadModal';
import ViewCallbacksModal from '@/components/ViewCallbacksModal';
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
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export type Lead = Database['public']['Tables']['leads']['Row'];

const AgentConsole: React.FC = () => {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { setAudioElement } = useSip();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const simulateIncomingCall = () => {
    toast({
      title: (
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-2 text-green-500 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
          <span>Incoming Call</span>
        </div>
      ),
      description: "From: +1 (555) 123-4567 (Jane Doe)",
      duration: 15000,
      action: (
        <>
          <ToastAction
            altText="Answer"
            onClick={() => {
              toast({ description: "Call answered (simulation)." });
            }}
          >
            Answer
          </ToastAction>
          <ToastAction
            altText="Decline"
            onClick={() => {
              toast({ description: "Call declined (simulation).", variant: "destructive" });
            }}
          >
            Decline
          </ToastAction>
        </>
      ),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <audio ref={audioRef} />
      <DispositionModal />
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Agent Console</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 flex items-center gap-4 border-r pr-4">
              <span>Session: {formattedCurrentSessionTime}</span>
              <span>Break: {formattedTotalBreakTime}</span>
              <span>Total Today: {formattedTotalSessionTime}</span>
            </div>
            <Button variant="destructive" onClick={handleEndSession}>
              <PhoneOff className="mr-2 h-4 w-4" /> End Session
            </Button>
            <Button variant={isPaused ? "default" : "outline"} onClick={togglePause}>
              <Pause className="mr-2 h-4 w-4" /> {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

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
              <DialPad lead={currentLead} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AddLeadModal onLeadAdded={handleLeadAction} />
          <UpdateLeadModal lead={currentLead} onLeadUpdated={handleLeadAction} />
          <SearchLeadModal onLeadSelect={setCurrentLead} />
          <ViewCallbacksModal />
          <Button variant="secondary" className="w-full" onClick={simulateIncomingCall}>
            Simulate Incoming Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentConsole;
