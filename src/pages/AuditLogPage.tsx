
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuditLog } from '@/types/audit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching audit logs:', error);
    throw new Error(error.message);
  }
  return data;
};

const AuditLogPage: React.FC = () => {
  const { data: logs, isLoading, isError, error } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: fetchAuditLogs,
  });

  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
        </TableRow>
      ));
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-red-500">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading audit logs: {error.message}</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    
    if (!logs || logs.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No audit logs found.
                </TableCell>
            </TableRow>
        );
    }

    return logs.map((log) => (
      <TableRow key={log.id}>
        <TableCell>{format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
        <TableCell>{log.user_email || 'System'}</TableCell>
        <TableCell><pre className="font-mono text-xs">{log.action}</pre></TableCell>
        <TableCell><pre className="text-xs">{JSON.stringify(log.details, null, 2)}</pre></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center"><FileText className="mr-3"/>Audit Log</CardTitle>
              <CardDescription>A record of important events and changes within the system.</CardDescription>
            </div>
            <Link to="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableBody()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogPage;
