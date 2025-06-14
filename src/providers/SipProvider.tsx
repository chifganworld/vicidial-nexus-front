
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SessionState, UserAgentState } from 'sip.js';
import { useSipConnection } from '@/hooks/useSipConnection';
import { useSipSession, CallContextType } from '@/hooks/useSipSession';
import { useSipDisposition } from '@/hooks/useSipDisposition';

type SipContextType = {
  connectionState: UserAgentState;
  sessionState: SessionState;
  makeCall: (destination: string, leadId?: number | null) => void;
  hangup: () => void;
  setAudioElement: (element: HTMLAudioElement | null) => void;
  isMuted: boolean;
  toggleMute: () => void;
  transfer: (destination: string) => void;
  callContext: CallContextType | null;
  submitDisposition: (disposition: { status: string; notes: string }) => Promise<void>;
  clearCallContext: () => void;
};

const SipContext = createContext<SipContextType | undefined>(undefined);

export const useSip = () => {
  const context = useContext(SipContext);
  if (!context) {
    throw new Error('useSip must be used within a SipProvider');
  }
  return context;
};

export const SipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const { userAgent, connectionState, sipSettings } = useSipConnection();
  
  const { 
    sessionState, 
    makeCall, 
    hangup, 
    toggleMute, 
    isMuted, 
    transfer, 
    callContext, 
    clearCallContext 
  } = useSipSession(userAgent, sipSettings, audioElement);
  
  const { submitDisposition } = useSipDisposition(callContext, clearCallContext);

  const value: SipContextType = {
    connectionState,
    sessionState,
    makeCall,
    hangup,
    setAudioElement,
    isMuted,
    toggleMute,
    transfer,
    callContext,
    submitDisposition,
    clearCallContext,
  };

  return <SipContext.Provider value={value}>{children}</SipContext.Provider>;
};
