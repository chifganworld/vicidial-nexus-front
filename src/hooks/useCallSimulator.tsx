
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

export const useCallSimulator = () => {
    const [simulatedCallDuration, setSimulatedCallDuration] = useState<number | undefined>(undefined);
    const [simulatedCallToastId, setSimulatedCallToastId] = useState<string | number | undefined>();
    const simCallTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (simCallTimerRef.current) {
                clearInterval(simCallTimerRef.current);
            }
        };
    }, []);

    const handleSimulatedHangUp = () => {
        if (simCallTimerRef.current) {
            clearInterval(simCallTimerRef.current);
            simCallTimerRef.current = null;
        }
        setSimulatedCallDuration(undefined);
        if (simulatedCallToastId) {
            toast.dismiss(simulatedCallToastId);
            setSimulatedCallToastId(undefined);
        }
    };

    const simulateIncomingCall = () => {
        const toastId = toast(
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-green-500 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                    <div>
                        <div className="font-semibold">Incoming Call</div>
                        <p className="text-sm text-muted-foreground">From: +1 (555) 123-4567 (Jane Doe)</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                        // Start timer
                        setSimulatedCallDuration(0);
                        if (simCallTimerRef.current) clearInterval(simCallTimerRef.current);
                        simCallTimerRef.current = setInterval(() => {
                            setSimulatedCallDuration(prev => (prev !== undefined ? prev + 1 : 0));
                        }, 1000);

                        // Update toast to "connected" state
                        toast.success(
                            <div className="font-semibold">Call answered (simulation)</div>,
                            {
                                id: toastId,
                                description: "You are now connected.",
                                duration: 3000,
                            }
                        );
                    }}>Answer</Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                        toast.error("Call declined (simulation).", { duration: 2000 });
                        toast.dismiss(toastId);
                        setSimulatedCallToastId(undefined);
                    }}>Decline</Button>
                </div>
            </div>, {
            duration: 15000,
            onDismiss: () => {
                if (simulatedCallToastId === toastId) {
                    setSimulatedCallToastId(undefined);
                }
            },
        });
        setSimulatedCallToastId(toastId);
    };
    
    return {
        simulatedCallDuration,
        handleSimulatedHangUp,
        simulateIncomingCall
    };
};
