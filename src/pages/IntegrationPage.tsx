
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming Label might be used
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription, // Added import
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types'; // Assuming this was generated/exists
import { Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

type VicidialIntegrationFormData = z.infer<typeof vicidialIntegrationSchema>;
type VicidialIntegrationTableRow = Database['public']['Tables']['vicidial_integration']['Row'];

const vicidialIntegrationSchema = z.object({
  vicidial_domain: z.string().min(1, 'Vicidial domain is required').url('Must be a valid URL (e.g., https://example.com)'),
  api_user: z.string().min(1, 'API user is required'),
  api_password: z.string().min(1, 'API password is required'),
  ports: z.string().optional(),
});

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
        .limit(1) // Assuming one global setting or fetching the first one
        .single(); // Use single if you expect one row or null

      if (error && error.code !== 'PGRST116') { // PGRST116: '0 rows' error for single()
        toast.error('Failed to load Vicidial settings: ' + error.message);
      } else if (data) {
        form.reset({
          vicidial_domain: data.vicidial_domain,
          api_user: data.api_user,
          api_password: data.api_password, // Note: displaying password is not secure
          ports: data.ports || '',
        });
        setSettingsId(data.id);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, [form]);

  const onSubmit = async (values: VicidialIntegrationFormData) => {
    setIsLoading(true);
    let responseError = null;

    if (settingsId) {
      // Update existing settings
      const { error } = await supabase
        .from('vicidial_integration')
        .update({
          vicidial_domain: values.vicidial_domain,
          api_user: values.api_user,
          api_password: values.api_password, // Security concern: saving plain password
          ports: values.ports,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settingsId);
      responseError = error;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('vicidial_integration')
        .insert([{
          vicidial_domain: values.vicidial_domain,
          api_user: values.api_user,
          api_password: values.api_password, // Security concern: saving plain password
          ports: values.ports,
        }])
        .select()
        .single();
      responseError = error;
      if (data) {
        setSettingsId(data.id);
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Vicidial Integration Settings</CardTitle>
            <Link to="/supervisor"> {/* Or appropriate back link */}
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CardDescription>
            Configure the connection details for your Vicidial server.
            Be careful with API credentials.
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
                    <FormDescription>
                      The full URL of your Vicidial server.
                    </FormDescription>
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
                      <Input placeholder="api_username" {...field} />
                    </FormControl>
                    <FormDescription>
                      The username for Vicidial API access.
                    </FormDescription>
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
                      <Input type="password" placeholder="api_password" {...field} />
                    </FormControl>
                    <FormDescription>
                      The password for Vicidial API access. Stored as plain text, consider security implications.
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
                      Specify any relevant ports, like WebRTC or API ports if non-standard.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </Form>
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

