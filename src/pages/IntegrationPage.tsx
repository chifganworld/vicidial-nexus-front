
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

const IntegrationPage: React.FC = () => {
  const [settingsId, setSettingsId] = useState<string | null>(null);
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
        setSettingsId(rowData.id);
      }
      
      // TODO: Fetch SIP settings when the table is available
      
      setIsLoading(false);
    };
    fetchSettings();
  }, [vicidialForm]);

  const onVicidialSubmit = async (values: VicidialIntegrationFormData) => {
    setIsLoading(true);
    let responseError = null;

    if (settingsId) {
      const { error } = await supabase
        .from('vicidial_integration')
        .update({
          vicidial_domain: values.vicidial_domain,
          api_user: values.api_user,
          api_password: values.api_password,
          ports: values.ports,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settingsId);
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
        setSettingsId(rowData.id);
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
    console.log('Submitting SIP settings:', values);
    // In a future step, this will save to a `sip_integrations` table in Supabase.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    toast.info('SIP settings form submitted. Database connection coming next!');
    setIsLoading(false);
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
