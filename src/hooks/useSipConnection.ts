
import { useState, useEffect } from 'react';
import { UserAgent, UserAgentState, Invitation } from 'sip.js';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type SipSettings = {
  sip_server_domain: string;
  sip_protocol: 'wss' | 'ws' | 'sip' | 'pjsip';
  sip_server_port: number;
};

export const useSipConnection = () => {
  const [userAgent, setUserAgent] = useState<UserAgent | null>(null);
  const [connectionState, setConnectionState] = useState<UserAgentState>(UserAgentState.Stopped);

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
        onInvite: (invitation: Invitation) => {
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
      
      return () => {
        if (ua?.state !== UserAgentState.Stopped) {
          ua?.stop();
        }
      };
    }
  }, [sipSettings, userProfile, userAgent]);

  return { userAgent, connectionState, sipSettings };
};
