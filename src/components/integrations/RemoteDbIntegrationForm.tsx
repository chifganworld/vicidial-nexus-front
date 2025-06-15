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
import { Save, Wifi, DatabaseZap } from 'lucide-react';
import { RemoteDbIntegrationFormData } from '@/features/integrations/remoteDbSchemas';

interface RemoteDbIntegrationFormProps {
  form: UseFormReturn<RemoteDbIntegrationFormData>;
  onSubmit: (values: RemoteDbIntegrationFormData) => Promise<void>;
  isLoading: boolean;
  onTestConnection: () => Promise<void>;
  isTesting: boolean;
  onInitializeDatabase: () => Promise<void>;
  isInitializing: boolean;
}

const RemoteDbIntegrationForm: React.FC<RemoteDbIntegrationFormProps> = ({ form, onSubmit, isLoading, onTestConnection, isTesting, onInitializeDatabase, isInitializing }) => {
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
        <div className="flex w-full space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onTestConnection} disabled={isLoading || isTesting || isInitializing || form.formState.isSubmitting} className="w-1/2">
            <Wifi className="mr-2 h-4 w-4" />
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button type="submit" disabled={isLoading || isTesting || isInitializing || form.formState.isSubmitting} className="w-1/2">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <div className="pt-6 border-t mt-6">
          <FormLabel>Database Initialization</FormLabel>
          <FormDescription className="mt-1">
            Run a script to set up the necessary tables and schema for the application on the remote database. This is a potentially destructive, one-time operation.
          </FormDescription>
          <Button type="button" variant="destructive" onClick={onInitializeDatabase} disabled={isLoading || isTesting || isInitializing || form.formState.isSubmitting} className="w-full mt-2">
            <DatabaseZap className="mr-2 h-4 w-4" />
            {isInitializing ? 'Initializing...' : 'Initialize Database'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RemoteDbIntegrationForm;
