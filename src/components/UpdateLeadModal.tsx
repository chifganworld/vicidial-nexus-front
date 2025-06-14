
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
import { Edit } from 'lucide-react'; // Using Edit icon

interface LeadData {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

// Placeholder for current lead data. In a real app, this would come from props or state.
const currentLeadData: LeadData = {
  name: 'John Doe', // Same as sampleLead in LeadInfoDisplay for now
  phone: '555-123-4567',
  email: 'john.doe@example.com',
  notes: 'Initial contact, interested in Product X. Follow up next week regarding pricing details and a potential demo schedule. Mentioned budget concerns.',
};

const UpdateLeadModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<LeadData>(currentLeadData);
  const { toast } = useToast();

  // Effect to reset form data when modal is opened with current lead data
  useEffect(() => {
    if (isOpen) {
      setFormData(currentLeadData);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this updated data to a backend or state management
    console.log('Updated Lead Data:', formData);
    toast({
      title: 'Lead Updated Successfully!',
      description: `Name: ${formData.name}, Phone: ${formData.phone}`,
      variant: 'default',
    });
    setIsOpen(false); // Close dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
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
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
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

