
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, UserRole } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

export const userFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  sip_number: z.string().optional(),
  webrtc_number: z.string().optional(),
  sip_password: z.string().optional(),
  roles: z.array(z.enum(['agent', 'supervisor', 'admin'])).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one role.',
  }),
});

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'agent', label: 'Agent' },
  { id: 'supervisor', label: 'Supervisor' },
  { id: 'admin', label: 'Admin' },
];

interface UserFormProps {
  user: User;
  onSubmit: (values: z.infer<typeof userFormSchema>) => void;
  isPending: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, isPending }) => {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: user.full_name || '',
      sip_number: user.sip_number || '',
      webrtc_number: user.webrtc_number || '',
      sip_password: '', // Leave blank to not change password
      roles: user.roles || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sip_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIP Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1001" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="webrtc_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WebRTC Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1001" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sip_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIP Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Leave blank to keep current" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles"
          render={() => (
              <FormItem>
                  <div className="mb-2">
                      <FormLabel>Roles</FormLabel>
                  </div>
                  <div className="space-y-2">
                  {ROLES.map((item) => (
                      <FormField
                          key={item.id}
                          control={form.control}
                          name="roles"
                          render={({ field }) => {
                              return (
                                  <FormItem
                                      key={item.id}
                                      className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                      <FormControl>
                                          <Checkbox
                                              checked={field.value?.includes(item.id)}
                                              onCheckedChange={(checked) => {
                                                  const updatedRoles = checked
                                                      ? [...field.value, item.id]
                                                      : field.value?.filter(
                                                          (value) => value !== item.id
                                                        );
                                                  field.onChange(updatedRoles);
                                              }}
                                          />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                          {item.label}
                                      </FormLabel>
                                  </FormItem>
                              );
                          }}
                      />
                  ))}
                  </div>
                  <FormMessage />
              </FormItem>
          )}
        />
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UserForm;
