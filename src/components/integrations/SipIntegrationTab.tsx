
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { sipIntegrationSchema, SipIntegrationFormData } from '@/features/integrations/sipSchemas';
import SipIntegrationForm from '@/components/integrations/SipIntegrationForm';

type SipIntegrationTableRow = Database['public']['Tables']['sip_integration']['Row'];

const SipIntegrationTab: React.FC = () => {
    const [sipSettingsId, setSipSettingsId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
    }, [sipForm]);
    
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
        <SipIntegrationForm
            form={sipForm}
            onSubmit={onSipSubmit}
            isLoading={isLoading}
        />
    );
};

export default SipIntegrationTab;
