
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserAgent, Inviter, SessionState, UserAgentState, Session } from 'sip.js';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type SipContextType = {
  connectionState: UserAgentState;
  sessionState: SessionState;
  makeCall: (destination: string) => void;
  hangup: () => void;
  setAudioElement: (element: HTMLAudioElement | null) => void;
};

const SipContext = createContext<SipContextType | undefined>(undefined);

export const useSip = () => {
  const context = useContext(SipContext);
  if (!context) {
    throw new Error('useSip must be used within a SipProvider');
  }
  return context;
};

type SipSettings = {
  sip_server_domain: string;
  sip_protocol: 'wss' | 'ws' | 'sip' | 'pjsip';
  sip_server_port: number;
};

export const SipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [connectionState, setConnectionState] = useState<UserAgentState>(UserAgentState.Stopped);
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.Initial);

  const { data: sipSettings } = useQuery<SipSettings | null>({
    queryKey: ['sipSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sip_integration').select('*').limit(1).single();
      if (error && error.code !== 'PGRST116') { // Ignore 'single row not found'
        console.error('Error fetching SIP settings:', error);
        toast({ title: 'Error fetching SIP settings', description: error.message, variant: 'destructive' });
        return null;
      }
      return data;
    },
    staleTime: Infinity,
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfileSip'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase.from('profiles').select('sip_number, sip_password').eq('id', user.id).single();
      if (error) {
        console.error('Error fetching user profile for SIP:', error);
        return null;
      }
      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!sipSettings || !userProfile || !userProfile.sip_number || !userProfile.sip_password) {
      return;
    }

    if (!userAgent) {
      const server = `${sipSettings.sip_protocol}://${sipSettings.sip_server_domain}:${sipSettings.sip_server_port}`;
      const uri = UserAgent.makeURI(`sip:${userProfile.sip_number}@${sipSettings.sip_server_domain}`);
      if (!uri) {
        console.error("Failed to create URI");
        return;
      }

      const ua = new UserAgent({
        uri,
        transportOptions: { server },
        authorizationUsername: userProfile.sip_number,
        authorizationPassword: userProfile.sip_password,
        userAgentString: 'LovableCallCenter/1.0',
      });

      ua.delegate = {
        onConnect: () => setConnectionState(UserAgentState.Started),
        onDisconnect: () => setConnectionState(UserAgentState.Stopped),
        onInvite: (invitation) => {
          // Handle incoming calls here if needed
          invitation.accept();
        },
      };

      ua.stateChange.addListener((newState) => {
        setConnectionState(newState);
        console.log(`SIP connection state changed to: ${newState}`);
      });

      ua.start().then(() => {
        setUserAgent(ua);
      }).catch(e => {
        console.error("Failed to start UserAgent:", e);
        toast({ title: "SIP Connection Failed", description: e.message, variant: "destructive" });
      });
    }

    return () => {
      if (userAgent?.state !== UserAgentState.Stopped) {
        userAgent?.stop();
      }
    };
  }, [sipSettings, userProfile, userAgent]);

  useEffect(() => {
    if (session) {
      session.stateChange.addListener((newState) => {
        setSessionState(newState);
        console.log(`SIP session state changed to: ${newState}`);
        if(newState === SessionState.Terminated) {
            setSession(null);
        }
      });
    }
  }, [session]);

  const makeCall = useCallback(async (destination: string) => {
    if (!userAgent || !sipSettings) {
      toast({ title: "SIP client not ready", description: "Please check your SIP settings and connection.", variant: "destructive" });
      return;
    }
    if (session) {
      toast({ title: "Already in a call", variant: "default" });
      return;
    }

    const target = UserAgent.makeURI(`sip:${destination}@${sipSettings.sip_server_domain}`);
    if (!target) {
      toast({ title: 'Invalid number', description: `Could not create a valid SIP URI for ${destination}`, variant: 'destructive' });
      return;
    }

    const inviter = new Inviter(userAgent, target);

    inviter.delegate = {
      onTrackAdded: () => {
        if (audioElement) {
          const remoteStream = new MediaStream();
          inviter.sessionDescriptionHandler?.peerConnection?.getReceivers().forEach(receiver => {
            if(receiver.track) remoteStream.addTrack(receiver.track);
          });
          audioElement.srcObject = remoteStream;
          audioElement.play().catch(e => console.error("Audio play failed", e));
        }
      }
    }
    setSession(inviter);
    await inviter.invite();

  }, [userAgent, sipSettings, session, audioElement]);

  const hangup = useCallback(async () => {
    if (session) {
      if (session.state === SessionState.Established) {
        await session.bye();
      } else if (session.state === SessionState.Initial || session.state === SessionState.Establishing) {
        await session.cancel();
      }
      setSession(null);
      setSessionState(SessionState.Initial);
    }
  }, [session]);

  const value = {
    connectionState,
    sessionState,
    makeCall,
    hangup,
    setAudioElement,
  };

  return <SipContext.Provider value={value}>{children}</SipContext.Provider>;
};
