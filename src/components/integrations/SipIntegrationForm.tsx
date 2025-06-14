
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { SipIntegrationFormData } from '@/features/integrations/sipSchemas';

interface SipIntegrationFormProps {
  form: UseFormReturn<SipIntegrationFormData>;
  onSubmit: (values: SipIntegrationFormData) => Promise<void>;
  isLoading: boolean;
}

const SipIntegrationForm: React.FC<SipIntegrationFormProps> = ({ form, onSubmit, isLoading }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="sip_server_domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIP Server Domain</FormLabel>
              <FormControl>
                <Input placeholder="sip.example.com" {...field} />
              </FormControl>
              <FormDescription>
                The domain or IP address of your SIP server/proxy.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sip_protocol"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Protocol</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="wss" id="wss"/>
                    </FormControl>
                    <Label htmlFor="wss" className="font-normal">
                      WSS (Secure)
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ws" id="ws"/>
                    </FormControl>
                    <Label htmlFor="ws" className="font-normal">
                      WS
                    </Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                The protocol for your SIP over WebSocket connection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sip_server_port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIP Server Port</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., 7443" {...field} />
              </FormControl>
              <FormDescription>
                The port for SIP over WebSocket connections (e.g., 7443 for WSS).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || form.formState.isSubmitting} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save SIP Settings'}
        </Button>
      </form>
    </Form>
  );
};

export default SipIntegrationForm;
