
import React, { useState } from 'react';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import GroupForm, { groupFormSchema } from './GroupForm';

const AddGroupDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createGroup, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof groupFormSchema>) => {
      const { error } = await supabase.rpc('create_group', {
        p_name: values.name,
        p_description: values.description || null,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Group created',
        description: 'The new group has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error creating group',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof groupFormSchema>) => {
    createGroup(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Group</DialogTitle>
          <DialogDescription>
            Create a new group to organize users.
          </DialogDescription>
        </DialogHeader>
        <GroupForm onSubmit={onSubmit} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupDialog;
