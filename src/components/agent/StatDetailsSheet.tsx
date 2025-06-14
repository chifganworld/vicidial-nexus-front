
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

type StatDetailsSheetProps = {
  statusName: string;
  statusTitle: string;
  children: React.ReactNode;
};

type CallRecord = {
  id: string;
  created_at: string;
  phone_number: string | null;
  duration_seconds: number | null;
  notes: string | null;
};

const fetchCallsByStatus = async (statusName: string): Promise<CallRecord[]> => {
  const { data, error } = await supabase.rpc('get_agent_calls_by_status' as any, { p_status: statusName });
  if (error) {
    console.error(`Error fetching calls for status ${statusName}:`, error);
    throw new Error(error.message);
  }
  return data || [];
};

const StatDetailsSheet: React.FC<StatDetailsSheetProps> = ({ statusName, statusTitle, children }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: calls, isLoading, isError, error } = useQuery<CallRecord[], Error>({
    queryKey: ['callsByStatus', statusName],
    queryFn: () => fetchCallsByStatus(statusName),
    enabled: isOpen, // Only fetch when the sheet is open
  });

  React.useEffect(() => {
    if (isError) {
      toast({
        title: `Error fetching ${statusTitle}`,
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast, statusTitle]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{statusTitle}</SheetTitle>
          <SheetDescription>
            Showing the last 20 calls with status "{statusName}".
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="py-4">
            {isLoading && (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}
            {isError && <p className="text-red-500">Could not load call details.</p>}
            {!isLoading && !isError && calls && calls.length > 0 && (
              <div className="space-y-4">
                {calls.map((call) => (
                  <div key={call.id} className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{call.phone_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(call.created_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                    {call.duration_seconds !== null && (
                      <p className="text-sm text-muted-foreground">Duration: {call.duration_seconds}s</p>
                    )}
                    {call.notes && <p className="mt-2 text-sm">{call.notes}</p>}
                  </div>
                ))}
              </div>
            )}
             {!isLoading && !isError && calls && calls.length === 0 && (
                <p>No calls found with status "{statusName}".</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default StatDetailsSheet;
