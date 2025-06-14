
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];

interface FormData {
  name: string;
  phone_number: string;
  email: string;
  notes: string;
}

interface UpdateLeadModalProps {
  lead: Lead | null;
  onLeadUpdated: () => void;
}

const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({ lead, onLeadUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', phone_number: '', email: '', notes: '' });
  const { toast } = useToast();

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        phone_number: lead.phone_number || '',
        email: lead.email || '',
        notes: lead.notes || '',
      });
    }
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) {
      toast({ title: "No lead selected", description: "Please select a lead to update.", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('leads')
      .update({
        name: formData.name,
        phone_number: formData.phone_number,
        email: formData.email,
        notes: formData.notes,
      })
      .eq('id', lead.id);

    if (error) {
      toast({ title: "Error updating lead", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: 'Lead Updated Successfully!',
        description: `Name: ${formData.name}, Phone: ${formData.phone_number}`,
        variant: 'default',
      });
      onLeadUpdated();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={!lead}>
          <Edit className="mr-2 h-4 w-4" /> Update Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Lead Information</DialogTitle>
          <DialogDescription>
            Modify the lead details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone
              </Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="col-span-3"
                type="tel"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                type="email"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Update notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLeadModal;
