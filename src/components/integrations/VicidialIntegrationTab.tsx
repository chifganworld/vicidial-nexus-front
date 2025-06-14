
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import IntegrationForm from '@/components/integrations/IntegrationForm';
import { vicidialIntegrationSchema, VicidialIntegrationFormData } from '@/features/integrations/vicidialSchemas';

type VicidialIntegrationTableRow = Database['public']['Tables']['vicidial_integration']['Row'];

const VicidialIntegrationTab: React.FC = () => {
  const [vicidialSettingsId, setVicidialSettingsId] = useState<string | null>(null);
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
      setIsLoading(false);
    };
    fetchSettings();
  }, [vicidialForm]);

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

  return (
    <IntegrationForm
      form={vicidialForm}
      onSubmit={onVicidialSubmit}
      isLoading={isLoading}
    />
  );
};

export default VicidialIntegrationTab;
