
import React, { useState } from 'react';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import UserForm, { userFormSchema } from './UserForm';
import { User } from '@/types/user';

interface EditUserDialogProps {
  user: User;
  children: React.ReactNode;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof userFormSchema>) => {
      const { error } = await supabase.rpc('update_user_details', {
        p_user_id: user.id,
        p_full_name: values.full_name,
        p_sip_number: values.sip_number || null,
        p_webrtc_number: values.webrtc_number || null,
        p_sip_password: values.sip_password || '',
        p_roles: values.roles,
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
      queryClient.invalidateQueries({ queryKey: ['userRoles', user.id] }); // Invalidate roles cache
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

  const onSubmit = (values: z.infer<typeof userFormSchema>) => {
    updateUser(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.full_name || user.email}</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile and roles. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <UserForm user={user} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
