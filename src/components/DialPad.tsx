import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, PhoneOff, ArrowLeft, Mic, MicOff, Timer } from 'lucide-react';
import { useSip } from '@/providers/SipProvider';
import { SessionState } from 'sip.js';
import TransferModal from '@/components/agent/TransferModal';
import { Lead } from '@/pages/AgentConsole';

interface DialPadProps {
  lead: Lead | null;
  simulatedDuration?: number;
  onSimulatedHangUp?: () => void;
}

const DialPad: React.FC<DialPadProps> = ({ lead, simulatedDuration, onSimulatedHangUp }) => {
  const [dialedNumber, setDialedNumber] = useState('');
  const { makeCall, hangup, sessionState, isMuted, toggleMute, callContext } = useSip();
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (sessionState === SessionState.Established && callContext?.startTime) {
      setCallDuration(Math.floor((Date.now() - (callContext.startTime || Date.now())) / 1000));
      timer = setInterval(() => {
        setCallDuration(prevDuration => prevDuration + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [sessionState, callContext?.startTime]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleKeyPress = (key: string) => {
    setDialedNumber((prev) => prev + key);
  };

  const handleClear = () => {
    setDialedNumber('');
  };

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (lead) {
      makeCall(dialedNumber, Number(lead.id));
    } else {
      makeCall(dialedNumber, null);
    }
  };

  const handleHangUp = () => {
    if (isSimulatedCallActive && onSimulatedHangUp) {
      onSimulatedHangUp();
    } else {
      hangup();
    }
  };

  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#'
  ];

  const isCallActive = sessionState === SessionState.Established;
  const isCallInProgress = sessionState !== SessionState.Initial && sessionState !== SessionState.Terminated;
  const isSimulatedCallActive = simulatedDuration !== undefined;

  return (
    <div className="w-full max-w-xs mx-auto p-4 space-y-4 bg-transparent rounded-lg shadow-none">
      <div className="relative">
        <Input
          type="text"
          value={dialedNumber}
          onChange={(e) => setDialedNumber(e.target.value)}
          placeholder="Enter number"
          className="text-center text-xl h-12"
          disabled={isCallInProgress || isSimulatedCallActive}
        />
      </div>

      <div className="text-center text-sm font-medium h-6">
        {isCallActive || isSimulatedCallActive ? (
            <div className="flex items-center justify-center gap-2 text-red-500">
                <Timer className="h-4 w-4 animate-pulse" />
                <span>{formatDuration(isSimulatedCallActive ? simulatedDuration : callDuration)}</span>
            </div>
        ) : (
            <span className="text-gray-500">{sessionState}</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {buttons.map((btn) => (
          <Button
            key={btn}
            className="text-xl h-14 rounded-lg bg-gray-800 dark:bg-black/50 border-gray-900 dark:border-black/50 border-b-4 active:border-b-0 hover:bg-gray-700 dark:hover:bg-black/40 active:translate-y-1 transition-all duration-150 text-green-400 [text-shadow:0_0_10px_theme(colors.green.400)] font-bold shadow-lg"
            onClick={() => handleKeyPress(btn)}
            disabled={isCallInProgress || isSimulatedCallActive}
          >
            {btn}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleBackspace} className="h-12 rounded-lg bg-gray-800/50 dark:bg-black/50 border-gray-900 dark:border-black/50 border-b-4 active:border-b-0 hover:bg-gray-800/70 dark:hover:bg-black/70 active:translate-y-1 transition-all duration-150 shadow-md text-gray-600 dark:text-gray-300" disabled={isCallInProgress || isSimulatedCallActive}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button onClick={handleClear} className="h-12 col-span-1 rounded-lg bg-red-200/50 dark:bg-red-800/50 border-red-300 dark:border-red-700 border-b-4 active:border-b-0 hover:bg-red-200/70 dark:hover:bg-red-700/70 active:translate-y-1 transition-all duration-150 shadow-md text-red-600 dark:text-red-300 font-semibold" disabled={isCallInProgress || isSimulatedCallActive}>
          Clear
        </Button>
      </div>

      {isCallActive && (
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={toggleMute} className="h-12">
                {isMuted ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <TransferModal disabled={!isCallActive} />
        </div>
      )}

      {isCallInProgress || isSimulatedCallActive ? (
        <Button
            variant="destructive"
            className="w-full h-14"
            onClick={handleHangUp}
        >
            <PhoneOff className="mr-2 h-5 w-5" /> Hang Up
        </Button>
      ) : (
        <Button
            variant="default"
            className="w-full h-14 bg-green-500 hover:bg-green-600 text-white"
            onClick={handleCall}
            disabled={!dialedNumber}
        >
            <Phone className="mr-2 h-5 w-5" /> Call
        </Button>
      )}
    </div>
  );
};

export default DialPad;
