
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sipTrunkSchema, SipTrunk } from '@/types/sip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SipTrunkFormProps {
  onSubmit: (values: SipTrunk) => void;
  isPending: boolean;
  trunk?: SipTrunk;
}

const SipTrunkForm: React.FC<SipTrunkFormProps> = ({ onSubmit, isPending, trunk }) => {
  const form = useForm<SipTrunk>({
    resolver: zodResolver(sipTrunkSchema),
    defaultValues: trunk || {
      trunk_name: '',
      is_active: true,
      host: '',
      port: 5060,
      protocol: 'udp',
      registration: 'none',
      username: '',
      secret: '',
      dtmf_mode: 'rfc2833',
      nat: 'yes',
      qualify: true,
      insecure: [],
      allow_codecs: ['ulaw', 'alaw'],
      from_user: '',
      from_domain: '',
    },
  });

  const registrationType = form.watch('registration');

  const insecureOptions = [{id: 'port', label: 'Port'}, {id: 'invite', label: 'Invite'}];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[60vh] p-4">
          <div className="space-y-4">
            <FormField control={form.control} name="trunk_name" render={({ field }) => (
              <FormItem><FormLabel>Trunk Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel>Active</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}/>
            <FormField control={form.control} name="host" render={({ field }) => (
              <FormItem><FormLabel>Host</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="port" render={({ field }) => (
              <FormItem><FormLabel>Port</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="protocol" render={({ field }) => (
              <FormItem><FormLabel>Protocol</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="udp">UDP</SelectItem><SelectItem value="tcp">TCP</SelectItem><SelectItem value="tls">TLS</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="registration" render={({ field }) => (
              <FormItem><FormLabel>Registration</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="none">None (IP Auth)</SelectItem><SelectItem value="user_pass">User/Pass</SelectItem></SelectContent>
              </Select><FormMessage /></FormItem>
            )}/>
            {registrationType === 'user_pass' && (
              <>
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} value={field.value || ''}/></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="secret" render={({ field }) => (
                  <FormItem><FormLabel>Secret</FormLabel><FormControl><Input type="password" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                )}/>
              </>
            )}
            <FormField control={form.control} name="dtmf_mode" render={({ field }) => (
              <FormItem><FormLabel>DTMF Mode</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="rfc2833">rfc2833</SelectItem><SelectItem value="inband">inband</SelectItem>
                  <SelectItem value="info">info</SelectItem><SelectItem value="auto">auto</SelectItem>
                </SelectContent>
              </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="nat" render={({ field }) => (
              <FormItem><FormLabel>NAT</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="no">no</SelectItem><SelectItem value="force_rport,comedia">force_rport,comedia</SelectItem><SelectItem value="yes">yes</SelectItem>
                </SelectContent>
              </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="qualify" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel>Qualify</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}/>
            <FormField control={form.control} name="insecure" render={() => (
              <FormItem><FormLabel>Insecure</FormLabel>
                {insecureOptions.map(item => (
                  <FormField key={item.id} control={form.control} name="insecure" render={({ field }) => (
                    <FormItem className="flex items-center space-x-3"><FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id as 'port' | 'invite')}
                        onCheckedChange={(checked) => {
                          const val = field.value || [];
                          return checked ? field.onChange([...val, item.id]) : field.onChange(val.filter(v => v !== item.id));
                        }}
                      />
                    </FormControl><FormLabel className="font-normal">{item.label}</FormLabel></FormItem>
                  )}/>
                ))}
              <FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="allow_codecs" render={({ field }) => (
              <FormItem><FormLabel>Allowed Codecs</FormLabel><FormControl>
                <Input placeholder="e.g., ulaw,alaw,g729" {...field} value={Array.isArray(field.value) ? field.value.join(',') : ''} onChange={e => field.onChange(e.target.value.split(','))} />
              </FormControl><FormDescription>Comma-separated list of codecs.</FormDescription><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="from_user" render={({ field }) => (
              <FormItem><FormLabel>From User</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="from_domain" render={({ field }) => (
              <FormItem><FormLabel>From Domain</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
          <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Trunk'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default SipTrunkForm;
