
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSip } from '@/providers/SipProvider';

const callStatuses = ['SALE', 'NOT_INTERESTED', 'CALLBACK', 'VOICEMAIL', 'ERROR'] as const;

const DispositionModal: React.FC = () => {
    const { callContext, submitDisposition, clearCallContext } = useSip();
    const [status, setStatus] = useState<string>('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!callContext) {
            // Reset form when modal closes
            setStatus('');
            setNotes('');
        }
    }, [callContext]);

    const handleSubmit = () => {
        if (status) {
            submitDisposition({ status, notes });
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            clearCallContext();
        }
    };

    return (
        <Dialog open={!!callContext} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Disposition Call</DialogTitle>
                    <DialogDescription>
                        Select a status and add notes for the call to {callContext?.phoneNumber}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select onValueChange={setStatus} value={status}>
                            <SelectTrigger id="status" className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {callStatuses.map(s => (
                                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3"
                            placeholder="Add call notes here..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!status}>Save Disposition</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DispositionModal;
