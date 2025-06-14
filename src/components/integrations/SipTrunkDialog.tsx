
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import SipTrunkForm from './SipTrunkForm';
import { SipTrunk } from '@/types/sip';

interface SipTrunkDialogProps {
  trunk?: SipTrunk;
  children: React.ReactNode;
}

const SipTrunkDialog: React.FC<SipTrunkDialogProps> = ({ trunk, children }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: manageTrunk, isPending } = useMutation({
    mutationFn: async (values: SipTrunk) => {
      const { data, error } = await supabase.from('sip_trunks').upsert(values).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast({ title: `SIP Trunk ${trunk ? 'updated' : 'created'} successfully.` });
      queryClient.invalidateQueries({ queryKey: ['sip_trunks'] });
      setOpen(false);
    },
    onError: (error) => {
      toast({ title: `Error ${trunk ? 'updating' : 'creating'} trunk`, description: error.message, variant: 'destructive' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{trunk ? 'Edit' : 'Add'} SIP Trunk</DialogTitle>
          <DialogDescription>Configure the details for your SIP trunk connection.</DialogDescription>
        </DialogHeader>
        <SipTrunkForm onSubmit={manageTrunk} isPending={isPending} trunk={trunk} />
      </DialogContent>
    </Dialog>
  );
};

export default SipTrunkDialog;
