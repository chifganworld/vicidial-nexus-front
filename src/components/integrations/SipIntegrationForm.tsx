
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
  const selectedProtocol = form.watch('sip_protocol');

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
                  className="flex flex-wrap items-center gap-x-4 gap-y-2"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="wss" id="wss"/>
                    </FormControl>
                    <Label htmlFor="wss" className="font-normal">
                      WSS (WebSocket Secure)
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ws" id="ws"/>
                    </FormControl>
                    <Label htmlFor="ws" className="font-normal">
                      WS (WebSocket)
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="sip" id="sip"/>
                    </FormControl>
                    <Label htmlFor="sip" className="font-normal">
                      SIP (UDP/TCP)
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pjsip" id="pjsip"/>
                    </FormControl>
                    <Label htmlFor="pjsip" className="font-normal">
                      PJSIP
                    </Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select the protocol for your SIP connection. Note: Web browsers can typically only use WSS or WS for direct connections.
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

        {(selectedProtocol === 'sip' || selectedProtocol === 'pjsip') && (
          <>
            <FormField
              control={form.control}
              name="sip_username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SIP Username (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="system_trunk_user" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    Username for your system to register with the SIP server (e.g., a trunk username).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sip_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SIP Password (Optional)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="trunk_secret" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    Password for your system to register with the SIP server.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="!mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium">Asterisk Manager (AMI) Settings</h3>
            <p className="text-sm text-muted-foreground">
                Optional: For features like live queue monitoring.
            </p>
        </div>

        <FormField
          control={form.control}
          name="ami_host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AMI Host</FormLabel>
              <FormControl>
                <Input placeholder="Leave blank to use SIP Server Domain" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                The host/IP of your Asterisk Manager Interface.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ami_port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AMI Port</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., 5038" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                The port for your AMI connection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ami_user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AMI Username</FormLabel>
              <FormControl>
                <Input placeholder="ami_user" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                Username for your AMI connection.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ami_secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AMI Secret (Optional)</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                Password/secret for your AMI connection. Stored securely.
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
