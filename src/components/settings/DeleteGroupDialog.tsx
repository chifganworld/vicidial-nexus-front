
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteGroupDialogProps {
  groupId: string;
  groupName: string;
  children: React.ReactNode;
}

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({ groupId, groupName, children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: deleteGroup, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('delete_group', { p_group_id: groupId });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast({
        title: 'Group deleted',
        description: `The group "${groupName}" has been deleted successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting group',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the group
            "{groupName}". Any users in this group will be unassigned from it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteGroup()}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGroupDialog;
