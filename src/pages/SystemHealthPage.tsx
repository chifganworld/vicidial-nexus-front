
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  DatabaseZap,
  CheckCircle,
  AlertTriangle,
  Server,
  Voicemail,
  FileText,
  Network,
  MemoryStick,
  HardDrive,
  Cpu,
  GitFork,
  Component,
  Rss,
  ShieldCheck,
} from 'lucide-react';

type HealthCheck = Tables<'system_health_logs'>;

const componentIcons: { [key: string]: React.ReactNode } = {
  'Database Connection': <DatabaseZap className="h-5 w-5" />,
  'Vicidial API': <Rss className="h-5 w-5" />,
  'Authentication Service': <ShieldCheck className="h-5 w-5" />,
  'Web Server': <Server className="h-5 w-5" />,
  'Asterisk Server': <Voicemail className="h-5 w-5" />,
  'Open Ports': <Network className="h-5 w-5" />,
  'System Logs': <FileText className="h-5 w-5" />,
  'RAM Usage': <MemoryStick className="h-5 w-5" />,
  'HDD Space': <HardDrive className="h-5 w-5" />,
  'CPU Usage': <Cpu className="h-5 w-5" />,
  'Running Threads': <GitFork className="h-5 w-5" />,
  'Running Processes': <Component className="h-5 w-5" />,
};

const SystemHealthPage: React.FC = () => {
  const queryClient = useQueryClient();

  // This simulates a system check by providing data to be logged.
  const checksToLog = [
    { component: 'Database Connection', status: 'ok', details: 'Connected to Supabase successfully.' },
    { component: 'Vicidial API', status: 'ok', details: 'API endpoint is responsive.' },
    { component: 'Authentication Service', status: 'ok', details: 'Supabase Auth is operational.' },
    { component: 'Web Server', status: 'ok', details: 'Main web server is online.' },
    { component: 'Asterisk Server', status: 'warning', details: 'High latency detected on SIP trunk.' },
    { component: 'Open Ports', status: 'ok', details: 'Standard ports (80, 443, 5060) are open.' },
    { component: 'System Logs', status: 'ok', details: 'No critical errors in access/error logs.' },
    { component: 'RAM Usage', status: 'ok', details: '5.2 / 16.0 GB used.' },
    { component: 'HDD Space', status: 'error', details: 'Disk nearly full: 480 / 500 GB used.' },
    { component: 'CPU Usage', status: 'ok', details: '15% usage, 3.2 GHz.' },
    { component: 'Running Threads', status: 'ok', details: '256 active threads.' },
    { component: 'Running Processes', status: 'ok', details: '128 active processes.' },
  ].map(check => ({ ...check, status: check.status as 'ok' | 'warning' | 'error' }));


  // Fetch the latest health status for each component
  const { data: healthChecks, isLoading, isError } = useQuery<HealthCheck[]>({
    queryKey: ['systemHealthLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_health_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching system health logs:', error);
        throw new Error(error.message);
      }

      // Get latest log for each component from the fetched logs
      const latestChecks = new Map<string, HealthCheck>();
      for (const check of data) {
        if (!latestChecks.has(check.component)) {
          latestChecks.set(check.component, check);
        }
      }
      return Array.from(latestChecks.values()).sort((a, b) => a.id - b.id);
    },
  });

  // Mutation to log the health checks
  const { mutate: logHealthChecks } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('system_health_logs').insert(checksToLog);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemHealthLogs'] });
    },
    onError: (error) => {
        console.error("Error logging health checks:", error.message);
    }
  });

  // Log checks on component mount
  useEffect(() => {
    logHealthChecks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center"><DatabaseZap className="mr-3"/>System Health</CardTitle>
              <CardDescription>Real-time status of critical system components.</CardDescription>
            </div>
            <Link to="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This page demonstrates logging health checks to a database. The data is fetched from the `system_health_logs` table. New logs are added each time you visit this page to simulate real-time monitoring.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Component</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                  </TableRow>
                ))
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500 py-8">
                    <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                    Failed to load system health data. You may not have the required permissions.
                  </TableCell>
                </TableRow>
              )}
              {healthChecks?.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{componentIcons[check.component] || <Component className="h-5 w-5" />}</TableCell>
                  <TableCell className="font-semibold">{check.component}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(check.status)}
                      <span className="capitalize">{check.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{check.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthPage;
