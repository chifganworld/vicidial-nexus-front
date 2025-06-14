
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Save } from 'lucide-react';

const vicidialIntegrationSchema = z.object({
  vicidial_domain: z.string().min(1, 'Vicidial domain is required').url('Must be a valid URL (e.g., https://vicidial.example.com)'),
  api_user: z.string().min(1, 'API user is required'),
  api_password: z.string().min(1, 'API password is required'),
  ports: z.string().optional(),
});

type VicidialIntegrationFormValues = z.infer<typeof vicidialIntegrationSchema>;

const IntegrationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingConfigId, setExistingConfigId] = useState<string | null>(null);

  const form = useForm<VicidialIntegrationFormValues>({
    resolver: zodResolver(vicidialIntegrationSchema),
    defaultValues: {
      vicidial_domain: '',
      api_user: '',
      api_password: '',
      ports: '',
    },
  });

  useEffect(() => {
    const fetchConfiguration = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('vicidial_integration')
        .select('*')
        .limit(1) // Assuming we manage one primary configuration for now
        .single(); // Use single to get one record or null

      if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        toast.error('Failed to load Vicidial configuration', { description: error.message });
      } else if (data) {
        form.reset({
          vicidial_domain: data.vicidial_domain,
          api_user: data.api_user,
          api_password: data.api_password, // Be cautious displaying passwords
          ports: data.ports || '',
        });
        setExistingConfigId(data.id);
      }
      setLoading(false);
    };

    fetchConfiguration();
  }, [form]);

  const onSubmit = async (values: VicidialIntegrationFormValues) => {
    setSaving(true);
    try {
      let response;
      const payload = {
        vicidial_domain: values.vicidial_domain,
        api_user: values.api_user,
        api_password: values.api_password,
        ports: values.ports,
      };

      if (existingConfigId) {
        // Update existing configuration
        response = await supabase
          .from('vicidial_integration')
          .update(payload)
          .eq('id', existingConfigId)
          .select()
          .single();
      } else {
        // Insert new configuration
        response = await supabase
          .from('vicidial_integration')
          .insert(payload)
          .select()
          .single();
      }

      const { data, error } = response;

      if (error) throw error;

      if (data) {
         setExistingConfigId(data.id); // Ensure we have the ID for subsequent saves
         form.reset(values); // Reset with current values to clear dirty state
         toast.success('Vicidial configuration saved successfully!');
      }

    } catch (error: any) {
      toast.error('Failed to save configuration', { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading Vicidial Configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-900 to-slate-700 p-4 md:p-8">
       <Link to="/agent" className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button variant="outline" size="icon" className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white hover:text-white">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to Dashboard</span>
        </Button>
      </Link>
      <div className="text-center mb-8">
        <Settings size={48} className="mx-auto text-blue-400 mb-4" />
        <h1 className="text-4xl font-bold text-white">Vicidial Integration</h1>
        <p className="text-lg text-slate-300">
          Configure your Vicidial server connection details.
        </p>
      </div>
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Connection Settings</CardTitle>
          <CardDescription>
            Enter the details required to connect to your Vicidial instance.
            Be mindful that the API password will be stored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vicidial_domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vicidial Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="https://vicidial.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="api_user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API User</FormLabel>
                    <FormControl>
                      <Input placeholder="api_user_name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="api_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      This password will be stored. Ensure it's an API-specific credential.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ports"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ports (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 80,443,10000-20000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Relevant ports for WebRTC or other connections, if needed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Configuration
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <footer className="mt-12 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Vicidial Nexus. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default IntegrationPage;
