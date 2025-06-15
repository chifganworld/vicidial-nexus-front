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
import { useGroups } from '@/hooks/useGroups';
import { useUserGroups } from '@/hooks/useUserGroups';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export const userFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  sip_number: z.string().optional(),
  webrtc_number: z.string().optional(),
  sip_password: z.string().optional(),
  roles: z.array(z.enum(['agent', 'supervisor', 'admin'])).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one role.',
  }),
  group_ids: z.array(z.string()).optional(),
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
  const { data: availableGroups, isLoading: isLoadingGroups } = useGroups();
  const { data: userGroupIds, isLoading: isLoadingUserGroups } = useUserGroups(user.id);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: user.full_name || '',
      sip_number: user.sip_number || '',
      webrtc_number: user.webrtc_number || '',
      sip_password: '', // Leave blank to not change password
      roles: user.roles || [],
      group_ids: [],
    },
  });

  React.useEffect(() => {
    if (userGroupIds) {
      form.setValue('group_ids', userGroupIds);
    }
  }, [userGroupIds, form]);

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
        <FormField
          control={form.control}
          name="group_ids"
          render={() => (
              <FormItem>
                  <div className="mb-2">
                      <FormLabel>Groups</FormLabel>
                  </div>
                  {isLoadingGroups || isLoadingUserGroups ? (
                    <div className="space-y-2 rounded-md border p-4">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ) : (
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-4 space-y-2">
                    {availableGroups?.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="group_ids"
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
                                                    const updatedGroups = checked
                                                        ? [...(field.value || []), item.id]
                                                        : field.value?.filter(
                                                            (value) => value !== item.id
                                                          );
                                                    field.onChange(updatedGroups);
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {item.name}
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />
                    ))}
                    {availableGroups?.length === 0 && <p className="text-sm text-muted-foreground">No groups available.</p>}
                    </div>
                  </ScrollArea>
                  )}
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
