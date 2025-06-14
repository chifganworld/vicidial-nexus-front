import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type User = {
  id: string;
  full_name: string | null;
  email: string | null;
  roles: string[];
  sip_number: string | null;
  webrtc_number: string | null;
  sip_password: string | null;
};

const formSchema = z.object({
  full_name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  sip_number: z.string().optional(),
  webrtc_number: z.string().optional(),
  sip_password: z.string().optional(),
});

interface EditUserDialogProps {
  user: User;
  children: React.ReactNode;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user.full_name || '',
      sip_number: user.sip_number || '',
      webrtc_number: user.webrtc_number || '',
      sip_password: user.sip_password || '',
    },
  });

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase.rpc('update_user_details', {
        p_user_id: user.id,
        p_full_name: values.full_name,
        p_sip_number: values.sip_number || null,
        p_webrtc_number: values.webrtc_number || null,
        p_sip_password: values.sip_password || null,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({
        title: 'User updated',
        description: `${user.full_name || user.email} has been updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['usersForManagement'] });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUser(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.full_name || user.email}</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
