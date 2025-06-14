
import React, { useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CalendarClock } from 'lucide-react'; // Icon for callbacks

interface Callback {
  id: string;
  leadName: string;
  phoneNumber: string;
  callbackTime: string;
  notes?: string;
}

const sampleCallbacks: Callback[] = [
  { id: '1', leadName: 'Alice Wonderland', phoneNumber: '555-0101', callbackTime: '2025-06-15 10:00 AM', notes: 'Discuss premium package.' },
  { id: '2', leadName: 'Bob The Builder', phoneNumber: '555-0102', callbackTime: '2025-06-15 02:30 PM', notes: 'Follow up on quote.' },
  { id: '3', leadName: 'Charlie Brown', phoneNumber: '555-0103', callbackTime: '2025-06-16 09:15 AM' },
  { id: '4', leadName: 'Diana Prince', phoneNumber: '555-0104', callbackTime: '2025-06-17 11:00 AM', notes: 'Needs demo of new feature.' },
];

const ViewCallbacksModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarClock className="mr-2 h-4 w-4" /> View Callbacks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Scheduled Callbacks</DialogTitle>
          <DialogDescription>
            Here is a list of your upcoming callbacks.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Callback Time</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleCallbacks.length > 0 ? (
                sampleCallbacks.map((callback) => (
                  <TableRow key={callback.id}>
                    <TableCell className="font-medium">{callback.leadName}</TableCell>
                    <TableCell>{callback.phoneNumber}</TableCell>
                    <TableCell>{callback.callbackTime}</TableCell>
                    <TableCell>{callback.notes || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No callbacks scheduled.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCallbacksModal;
