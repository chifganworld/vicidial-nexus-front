
import { useState, useEffect, useCallback } from 'react';
import { UserAgent, Inviter, SessionState, Session, Invitation, RTCRtpReceiver, RTCRtpSender } from 'sip.js';
import { toast } from '@/hooks/use-toast';

type SipSettings = {
  sip_server_domain: string;
  sip_protocol: 'wss' | 'ws' | 'sip' | 'pjsip';
  sip_server_port: number;
};

export type CallContextType = {
  leadId: number | null;
  phoneNumber: string;
  startTime: number | null;
};

export const useSipSession = (userAgent: UserAgent | null, sipSettings: SipSettings | null | undefined, audioElement: HTMLAudioElement | null) => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.Initial);
  const [isMuted, setIsMuted] = useState(false);
  const [callContext, setCallContext] = useState<CallContextType | null>(null);

  useEffect(() => {
    if (session) {
      const listener = (newState: SessionState) => {
        setSessionState(newState);
        console.log(`SIP session state changed to: ${newState}`);
        if (newState === SessionState.Terminated) {
          setSession(null);
        }
        if (newState === SessionState.Established) {
          setCallContext(prev => prev ? { ...prev, startTime: Date.now() } : null);
          if (audioElement) {
            const sdh = session.sessionDescriptionHandler;
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

  const makeCall = useCallback(async (destination: string, leadId?: number | null) => {
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
    
    setCallContext({ leadId: leadId ?? null, phoneNumber: destination, startTime: null });

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
  
  const clearCallContext = useCallback(() => {
    setCallContext(null);
  }, []);

  return { sessionState, makeCall, hangup, toggleMute, isMuted, transfer, callContext, clearCallContext };
};
