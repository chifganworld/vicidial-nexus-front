import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import RemoteDbIntegrationForm from '@/components/integrations/RemoteDbIntegrationForm';
import { remoteDbIntegrationSchema, RemoteDbIntegrationFormData } from '@/features/integrations/remoteDbSchemas';

type RemoteDbIntegrationTableRow = Database['public']['Tables']['remote_db_integration']['Row'];

const RemoteDbIntegrationTab: React.FC = () => {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const form = useForm<RemoteDbIntegrationFormData>({
    resolver: zodResolver(remoteDbIntegrationSchema),
    defaultValues: {
      host: '',
      port: '3306',
      db_name: '',
      db_user: '',
      db_password: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('remote_db_integration')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "exact one row not found" which is fine
        toast.error('Failed to load Remote DB settings: ' + error.message);
      } else if (data) {
        const rowData = data as RemoteDbIntegrationTableRow;
        form.reset({
          host: rowData.host,
          port: String(rowData.port),
          db_name: rowData.db_name,
          db_user: rowData.db_user,
          db_password: rowData.db_password,
        });
        setSettingsId(rowData.id);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, [form]);

  const onSubmit = async (values: RemoteDbIntegrationFormData) => {
    setIsLoading(true);
    let responseError = null;

    const dataToUpsert = {
      host: values.host,
      port: parseInt(values.port, 10),
      db_name: values.db_name,
      db_user: values.db_user,
      db_password: values.db_password,
      updated_at: new Date().toISOString(),
    };

    if (settingsId) {
      const { error } = await supabase
        .from('remote_db_integration')
        .update(dataToUpsert)
        .eq('id', settingsId);
      responseError = error;
    } else {
      const { data, error } = await supabase
        .from('remote_db_integration')
        .insert([{ ...dataToUpsert }])
        .select()
        .single();
      responseError = error;
      if (data) {
        const rowData = data as RemoteDbIntegrationTableRow;
        setSettingsId(rowData.id);
      }
    }

    setIsLoading(false);
    if (responseError) {
      toast.error('Failed to save Remote DB settings: ' + responseError.message);
    } else {
      toast.success('Remote DB settings saved successfully!');
    }
  };

  const handleTestConnection = async () => {
    const values = form.getValues();
    const result = remoteDbIntegrationSchema.safeParse(values);

    if (!result.success) {
      toast.error('Please fill in all required fields correctly before testing.');
      form.trigger();
      return;
    }

    setIsTesting(true);
    toast.info('Testing connection...');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('test-remote-db', {
        body: result.data,
      });

      if (invokeError) {
        throw invokeError;
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success(data.message || 'Connection successful!');
    } catch (error) {
      toast.error(`${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleInitializeDatabase = async () => {
    const values = form.getValues();
    const result = remoteDbIntegrationSchema.safeParse(values);

    if (!result.success) {
      toast.error('Please fill in all required fields correctly before initializing.');
      form.trigger();
      return;
    }
    
    setIsInitializing(true);
    toast.info('Initializing remote database...');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('initialize-remote-db', {
        body: result.data,
      });

      if (invokeError) {
        throw invokeError;
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast.success(data.message || 'Database initialized successfully!');
    } catch (error) {
      toast.error(`Initialization failed: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <RemoteDbIntegrationForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      onTestConnection={handleTestConnection}
      isTesting={isTesting}
      onInitializeDatabase={handleInitializeDatabase}
      isInitializing={isInitializing}
    />
  );
};

export default RemoteDbIntegrationTab;
