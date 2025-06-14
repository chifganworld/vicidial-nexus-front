
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import IntegrationPageHeader from '@/components/integrations/IntegrationPageHeader';
import IntegrationForm from '@/components/integrations/IntegrationForm';
import { vicidialIntegrationSchema, VicidialIntegrationFormData } from '@/features/integrations/vicidialSchemas';
import { sipIntegrationSchema, SipIntegrationFormData } from '@/features/integrations/sipSchemas';
import SipIntegrationForm from '@/components/integrations/SipIntegrationForm';

type VicidialIntegrationTableRow = Database['public']['Tables']['vicidial_integration']['Row'];
type SipIntegrationTableRow = Database['public']['Tables']['sip_integration']['Row'];

const IntegrationPage: React.FC = () => {
  const [vicidialSettingsId, setVicidialSettingsId] = useState<string | null>(null);
  const [sipSettingsId, setSipSettingsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const vicidialForm = useForm<VicidialIntegrationFormData>({
    resolver: zodResolver(vicidialIntegrationSchema),
    defaultValues: {
      vicidial_domain: '',
      api_user: '',
      api_password: '',
      ports: '',
    },
  });

  const sipForm = useForm<SipIntegrationFormData>({
    resolver: zodResolver(sipIntegrationSchema),
    defaultValues: {
      sip_server_domain: '',
      sip_protocol: 'wss',
      sip_server_port: '',
      sip_username: '',
      sip_password: '',
      ami_host: '',
      ami_port: '',
      ami_user: '',
      ami_secret: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vicidial_integration')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error('Failed to load Vicidial settings: ' + error.message);
      } else if (data) {
        const rowData = data as VicidialIntegrationTableRow;
        vicidialForm.reset({
          vicidial_domain: rowData.vicidial_domain,
          api_user: rowData.api_user,
          api_password: rowData.api_password,
          ports: rowData.ports || '',
        });
        setVicidialSettingsId(rowData.id);
      }
      
      const { data: sipData, error: sipError } = await supabase
        .from('sip_integration')
        .select('*')
        .limit(1)
        .single();
      
      if (sipError && sipError.code !== 'PGRST116') {
        toast.error('Failed to load SIP settings: ' + sipError.message);
      } else if (sipData) {
        const rowData = sipData as SipIntegrationTableRow;
        sipForm.reset({
          sip_server_domain: rowData.sip_server_domain,
          sip_protocol: rowData.sip_protocol as SipIntegrationFormData['sip_protocol'],
          sip_server_port: String(rowData.sip_server_port),
          sip_username: rowData.sip_username ?? '',
          sip_password: rowData.sip_password ?? '',
          ami_host: rowData.ami_host ?? '',
          ami_port: rowData.ami_port ? String(rowData.ami_port) : '',
          ami_user: rowData.ami_user ?? '',
          ami_secret: rowData.ami_secret ?? '',
        });
        setSipSettingsId(rowData.id);
      }
      
      setIsLoading(false);
    };
    fetchSettings();
  }, [vicidialForm, sipForm]);

  const onVicidialSubmit = async (values: VicidialIntegrationFormData) => {
    setIsLoading(true);
    let responseError = null;

    if (vicidialSettingsId) {
      const { error } = await supabase
        .from('vicidial_integration')
        .update({
          vicidial_domain: values.vicidial_domain,
          api_user: values.api_user,
          api_password: values.api_password,
          ports: values.ports,
          updated_at: new Date().toISOString(),
        })
        .eq('id', vicidialSettingsId);
      responseError = error;
    } else {
      const { data, error } = await supabase
        .from('vicidial_integration')
        .insert([{
          vicidial_domain: values.vicidial_domain,
          api_user: values.api_user,
          api_password: values.api_password,
          ports: values.ports,
        }])
        .select()
        .single();
      responseError = error;
      if (data) {
        const rowData = data as VicidialIntegrationTableRow;
        setVicidialSettingsId(rowData.id);
      }
    }

    setIsLoading(false);
    if (responseError) {
      toast.error('Failed to save Vicidial settings: ' + responseError.message);
    } else {
      toast.success('Vicidial settings saved successfully!');
    }
  };

  const onSipSubmit = async (values: SipIntegrationFormData) => {
    setIsLoading(true);
    let responseError = null;

    const sipDataToSave = {
      sip_server_domain: values.sip_server_domain,
      sip_protocol: values.sip_protocol,
      sip_server_port: parseInt(values.sip_server_port, 10),
      sip_username: values.sip_username || null,
      sip_password: values.sip_password || null,
      ami_host: values.ami_host || null,
      ami_port: values.ami_port ? parseInt(values.ami_port, 10) : null,
      ami_user: values.ami_user || null,
      ami_secret: values.ami_secret || null,
      updated_at: new Date().toISOString(),
    };

    if (sipSettingsId) {
      const { error } = await supabase
        .from('sip_integration')
        .update(sipDataToSave)
        .eq('id', sipSettingsId);
      responseError = error;
    } else {
      const { data, error } = await supabase
        .from('sip_integration')
        .insert([sipDataToSave])
        .select()
        .single();
      responseError = error;
      if (data) {
        const rowData = data as SipIntegrationTableRow;
        setSipSettingsId(rowData.id);
      }
    }
    
    setIsLoading(false);
    if (responseError) {
      toast.error('Failed to save SIP settings: ' + responseError.message);
    } else {
      toast.success('SIP settings saved successfully!');
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <IntegrationPageHeader backLink="/settings" />
        <CardContent>
          <Tabs defaultValue="vicidial" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vicidial">Vicidial API</TabsTrigger>
              <TabsTrigger value="sip">SIP Server</TabsTrigger>
            </TabsList>
            <TabsContent value="vicidial">
              <IntegrationForm
                form={vicidialForm}
                onSubmit={onVicidialSubmit}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="sip">
              <SipIntegrationForm
                form={sipForm}
                onSubmit={onSipSubmit}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">
            Changes will take effect immediately for new operations.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IntegrationPage;
