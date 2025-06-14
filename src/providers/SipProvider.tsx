import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserAgent, Inviter, SessionState, UserAgentState, Session, Invitation } from 'sip.js';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type SipContextType = {
  connectionState: UserAgentState;
  sessionState: SessionState;
  makeCall: (destination: string) => void;
  hangup: () => void;
  setAudioElement: (element: HTMLAudioElement | null) => void;
  isMuted: boolean;
  toggleMute: () => void;
  transfer: (destination: string) => void;
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
  const [isMuted, setIsMuted] = useState(false);

  const { data: sipSettings } = useQuery({
    queryKey: ['sipSettings'],
    queryFn: async (): Promise<SipSettings | null> => {
      const { data, error } = await supabase.from('sip_integration').select('sip_server_domain, sip_protocol, sip_server_port').limit(1).maybeSingle();
      if (error) {
        console.error('Error fetching SIP settings:', error);
        toast({ title: 'Error fetching SIP settings', description: error.message, variant: 'destructive' });
        return null;
      }
      return data ? data as SipSettings : null;
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
  }, [sipSettings, userProfile]);

  useEffect(() => {
    if (session) {
      const listener = (newState: SessionState) => {
        setSessionState(newState);
        console.log(`SIP session state changed to: ${newState}`);
        if (newState === SessionState.Terminated) {
          setSession(null);
        }
        if (newState === SessionState.Established) {
          if (audioElement) {
            const sdh = session.sessionDescriptionHandler;
            // The type definitions for sessionDescriptionHandler are likely incomplete.
            // We cast to any to access the underlying peerConnection.
            const peerConnection = (sdh as any)?.peerConnection;
            if (peerConnection) {
              const remoteStream = new MediaStream();
              peerConnection.getReceivers().forEach((receiver: RTCRtpReceiver) => {
                if (receiver.track) remoteStream.addTrack(receiver.track);
              });
              audioElement.srcObject = remoteStream;
              audioElement.play().catch(e => console.error("Audio play failed", e));
            }
          }
        }
      };
      session.stateChange.addListener(listener);

      return () => {
        session.stateChange.removeListener(listener);
      };
    }
  }, [session, audioElement]);

  const toggleMute = useCallback(() => {
    if (session && session.state === SessionState.Established) {
      const sdh = session.sessionDescriptionHandler;
      const peerConnection = (sdh as any)?.peerConnection;
      if (peerConnection) {
        const newMutedState = !isMuted;
        peerConnection.getSenders().forEach((sender: RTCRtpSender) => {
          if (sender.track && sender.track.kind === 'audio') {
            sender.track.enabled = !newMutedState;
          }
        });
        setIsMuted(newMutedState);
      }
    }
  }, [session, isMuted]);
  
  useEffect(() => {
    if (sessionState === SessionState.Terminated) {
      setIsMuted(false);
    }
  }, [sessionState]);

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
    setSession(inviter);
    await inviter.invite();

  }, [userAgent, sipSettings, session]);

  const transfer = useCallback(async (destination: string) => {
    if (!userAgent || !sipSettings) {
      toast({ title: "SIP client not ready", description: "Please check your SIP settings and connection.", variant: "destructive" });
      return;
    }
    if (session && session.state === SessionState.Established) {
        const target = UserAgent.makeURI(`sip:${destination}@${sipSettings.sip_server_domain}`);
        if (!target) {
            toast({ title: 'Invalid transfer number', description: `Could not create a valid SIP URI for ${destination}`, variant: 'destructive' });
            return;
        }
        await session.refer(target);
        toast({ title: 'Transfer initiated', description: `Transferring call to ${destination}` });
    }
  }, [session, sipSettings, userAgent]);

  const hangup = useCallback(async () => {
    if (session) {
      if (session.state === SessionState.Established) {
        await session.bye();
      } else if ((session.state === SessionState.Initial || session.state === SessionState.Establishing) && session instanceof Inviter) {
        await (session as Inviter).cancel();
      } else if ((session.state === SessionState.Initial || session.state === SessionState.Establishing) && session instanceof Invitation) {
        await (session as Invitation).reject();
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
    isMuted,
    toggleMute,
    transfer,
  };

  return <SipContext.Provider value={value}>{children}</SipContext.Provider>;
};
