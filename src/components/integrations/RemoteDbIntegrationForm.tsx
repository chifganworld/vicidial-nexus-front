
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
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
import { RemoteDbIntegrationFormData } from '@/features/integrations/remoteDbSchemas';

interface RemoteDbIntegrationFormProps {
  form: UseFormReturn<RemoteDbIntegrationFormData>;
  onSubmit: (values: RemoteDbIntegrationFormData) => Promise<void>;
  isLoading: boolean;
}

const RemoteDbIntegrationForm: React.FC<RemoteDbIntegrationFormProps> = ({ form, onSubmit, isLoading }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormControl>
                <Input placeholder="e.g., db.example.com" {...field} />
              </FormControl>
              <FormDescription>
                The hostname or IP address of your remote database server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3306" {...field} />
              </FormControl>
              <FormDescription>
                The port number for your remote database.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="db_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., my_database" {...field} />
              </FormControl>
              <FormDescription>
                The name of the database to connect to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="db_user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database User</FormLabel>
              <FormControl>
                <Input placeholder="e.g., db_user" {...field} />
              </FormControl>
              <FormDescription>
                The username for database access.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="db_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="db_password" {...field} />
              </FormControl>
              <FormDescription>
                The password for database access. Stored securely.
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

export default RemoteDbIntegrationForm;
