
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
import GroupForm, { groupFormSchema } from './GroupForm';
import { Group } from '@/hooks/useGroups';

interface EditGroupDialogProps {
  group: Group;
  children: React.ReactNode;
}

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({ group, children }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: updateGroup, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof groupFormSchema>) => {
      const { error } = await supabase.rpc('update_group', {
        p_group_id: group.id,
        p_name: values.name,
        p_description: values.description || null,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Group updated',
        description: `The group "${group.name}" has been updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error updating group',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof groupFormSchema>) => {
    updateGroup(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Group: {group.name}</DialogTitle>
          <DialogDescription>
            Make changes to the group details.
          </DialogDescription>
        </DialogHeader>
        <GroupForm group={group} onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog;
