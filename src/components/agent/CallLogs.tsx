
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const fetchCallLogs = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching call logs:', error);
    throw new Error(error.message);
  }

  return data;
};

const CallLogs: React.FC = () => {
  const { toast } = useToast();
  const { data: callLogs, isLoading, isError, error } = useQuery({
    queryKey: ['callLogs'],
    queryFn: fetchCallLogs,
  });

  React.useEffect(() => {
    if (isError) {
      toast({
        title: "Error fetching call logs",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return (
    <Card className="bg-green-950/20 backdrop-blur-sm border-green-400/20">
      <CardHeader>
        <CardTitle className="text-lg">Recent Call Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
        {isError && <p className="text-red-500">Error: {error.message}</p>}
        {callLogs && callLogs.length === 0 && <p>No call logs found.</p>}
        {callLogs && callLogs.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(new Date(log.created_at), 'Pp')}</TableCell>
                    <TableCell>{log.phone_number ?? 'N/A'}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.status === 'ANSWERED' ? 'bg-green-100 text-green-800' :
                            log.status === 'ABANDONED' ? 'bg-yellow-100 text-yellow-800' :
                            log.status === 'MISSED' ? 'bg-orange-100 text-orange-800' :
                            log.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {log.status}
                        </span>
                    </TableCell>
                    <TableCell>{log.duration_seconds ? `${log.duration_seconds}s` : 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.notes ?? 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CallLogs;
