
import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Save } from 'lucide-react';
import { vicidialIntegrationSchema, VicidialIntegrationFormData } from '@/features/integrations/vicidialSchemas';

interface IntegrationFormProps {
  form: UseFormReturn<VicidialIntegrationFormData>;
  onSubmit: (values: VicidialIntegrationFormData) => Promise<void>;
  isLoading: boolean;
}

const IntegrationForm: React.FC<IntegrationFormProps> = ({ form, onSubmit, isLoading }) => {
  return (
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
  );
};

export default IntegrationForm;
