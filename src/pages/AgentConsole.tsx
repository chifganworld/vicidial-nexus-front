
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import DialPad from '@/components/DialPad';
import StatsBar from '@/components/agent/StatsBar';
import CallLogs from '@/components/agent/CallLogs';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSip } from '@/providers/SipProvider';
import DispositionModal from '@/components/agent/DispositionModal';
import { useSessionTracker } from '@/hooks/useSessionTracker';
import LeadDetails from '@/components/agent/LeadDetails';
import AgentPerformance from '@/components/agent/AgentPerformance';
import AgentConsoleHeader from '@/components/agent/AgentConsoleHeader';
import QuickActions from '@/components/agent/QuickActions';
import { useDisplaySettings } from '@/contexts/DisplaySettingsContext';
import { useCurrentLead } from '@/hooks/useCurrentLead';
import { useCallSimulator } from '@/hooks/useCallSimulator';

const AgentConsole: React.FC = () => {
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { setAudioElement } = useSip();
  const navigate = useNavigate();
  const { settings } = useDisplaySettings();

  const { 
    isPaused, 
    togglePause, 
    endSession, 
    formattedCurrentSessionTime,
    formattedTotalBreakTime,
    formattedTotalSessionTime
  } = useSessionTracker();

  const { currentLead, setCurrentLead, isLoadingLead } = useCurrentLead();
  const { simulatedCallDuration, handleSimulatedHangUp, simulateIncomingCall } = useCallSimulator();


  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  const handleLeadAction = () => {
    queryClient.invalidateQueries({ queryKey: ['currentLead'] });
  };
  
  const handleEndSession = async () => {
    endSession();
    await supabase.auth.signOut();
    navigate('/auth');
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
          {settings.showAgentPerformance && <AgentPerformance />}
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
