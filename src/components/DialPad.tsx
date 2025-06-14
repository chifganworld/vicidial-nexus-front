
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, PhoneOff, ArrowLeft, Mic, MicOff, ArrowRightLeft } from 'lucide-react';
import { useSip } from '@/providers/SipProvider';
import { SessionState } from 'sip.js';
import TransferModal from '@/components/agent/TransferModal';

const DialPad: React.FC = () => {
  const [dialedNumber, setDialedNumber] = useState('');
  const { makeCall, hangup, sessionState, isMuted, toggleMute } = useSip();

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
    makeCall(dialedNumber);
  };

  const handleHangUp = () => {
    hangup();
  };

  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#'
  ];

  const isCallActive = sessionState === SessionState.Established;
  const isCallInProgress = sessionState !== SessionState.Initial && sessionState !== SessionState.Terminated;

  return (
    <div className="w-full max-w-xs mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md">
      <div className="relative">
        <Input
          type="text"
          value={dialedNumber}
          onChange={(e) => setDialedNumber(e.target.value)}
          placeholder="Enter number"
          className="text-center text-xl h-12"
        />
        <div className="text-center text-sm font-medium text-gray-500 h-6 absolute -bottom-6 w-full">
            {sessionState}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {buttons.map((btn) => (
          <Button
            key={btn}
            variant="outline"
            className="text-xl h-14"
            onClick={() => handleKeyPress(btn)}
          >
            {btn}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="ghost" onClick={handleBackspace} className="h-12" disabled={isCallInProgress}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button variant="destructive" onClick={handleClear} className="h-12 col-span-1" disabled={isCallInProgress}>
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

      {isCallInProgress ? (
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
