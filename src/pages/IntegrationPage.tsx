
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import IntegrationPageHeader from '@/components/integrations/IntegrationPageHeader';
import IntegrationForm from '@/components/integrations/IntegrationForm';
import { vicidialIntegrationSchema, VicidialIntegrationFormData } from '@/features/integrations/vicidialSchemas';

// This type remains here as it's specific to the data structure in Supabase table
type VicidialIntegrationTableRow = Database['public']['Tables']['vicidial_integration']['Row'];

const IntegrationPage: React.FC = () => {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VicidialIntegrationFormData>({
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
        const rowData = data as VicidialIntegrationTableRow; // Explicit cast if needed
        form.reset({
          vicidial_domain: rowData.vicidial_domain,
          api_user: rowData.api_user,
          api_password: rowData.api_password,
          ports: rowData.ports || '',
        });
        setSettingsId(rowData.id);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, [form]);

  const onSubmit = async (values: VicidialIntegrationFormData) => {
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
        const rowData = data as VicidialIntegrationTableRow; // Explicit cast
        setSettingsId(rowData.id);
      }
    }

    setIsLoading(false);
    if (responseError) {
      toast.error('Failed to save settings: ' + responseError.message);
    } else {
      toast.success('Vicidial settings saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <IntegrationPageHeader backLink="/settings" /> {/* Updated backlink to /settings */}
        <CardContent>
          <IntegrationForm
            form={form}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
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
