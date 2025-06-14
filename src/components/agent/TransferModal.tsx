
import React, { useState } from 'react';
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
import { useSip } from '@/providers/SipProvider';
import { ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

interface TransferModalProps {
  disabled: boolean;
  isSimulated?: boolean;
  onSimulatedHangUp?: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ disabled, isSimulated = false, onSimulatedHangUp }) => {
    const [open, setOpen] = useState(false);
    const [transferNumber, setTransferNumber] = useState('');
    const { transfer } = useSip();

    const handleTransfer = () => {
        if (isSimulated) {
            toast.info(`Call transferred to ${transferNumber} (simulation).`);
            if (onSimulatedHangUp) {
                onSimulatedHangUp();
            }
        } else {
            transfer(transferNumber);
        }
        setOpen(false);
        setTransferNumber('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" className="h-12 w-full" disabled={disabled}>
                    <ArrowRightLeft className="h-5 w-5 mr-2" /> Transfer
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Call</DialogTitle>
                    <DialogDescription>
                        Enter the number or extension to transfer the call to.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input 
                        placeholder="Enter number..."
                        value={transferNumber}
                        onChange={(e) => setTransferNumber(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleTransfer} disabled={!transferNumber}>Transfer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TransferModal;
