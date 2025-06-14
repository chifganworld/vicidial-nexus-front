
import React from 'react';
import { Link } from 'react-router-dom';
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

const SystemHealthPage: React.FC = () => {
  // Placeholder data
  const healthChecks = [
    { name: 'Database Connection', status: 'ok', details: 'Connected to Supabase successfully.', icon: <DatabaseZap className="h-5 w-5" /> },
    { name: 'Vicidial API', status: 'ok', details: 'API endpoint is responsive.', icon: <Rss className="h-5 w-5" /> },
    { name: 'Authentication Service', status: 'ok', details: 'Supabase Auth is operational.', icon: <ShieldCheck className="h-5 w-5" /> },
    { name: 'Web Server', status: 'ok', details: 'Main web server is online.', icon: <Server className="h-5 w-5" /> },
    { name: 'Asterisk Server', status: 'warning', details: 'High latency detected on SIP trunk.', icon: <Voicemail className="h-5 w-5" /> },
    { name: 'Open Ports', status: 'ok', details: 'Standard ports (80, 443, 5060) are open.', icon: <Network className="h-5 w-5" /> },
    { name: 'System Logs', status: 'ok', details: 'No critical errors in access/error logs.', icon: <FileText className="h-5 w-5" /> },
    { name: 'RAM Usage', status: 'ok', details: '5.2 / 16.0 GB used.', icon: <MemoryStick className="h-5 w-5" /> },
    { name: 'HDD Space', status: 'error', details: 'Disk nearly full: 480 / 500 GB used.', icon: <HardDrive className="h-5 w-5" /> },
    { name: 'CPU Usage', status: 'ok', details: '15% usage, 3.2 GHz.', icon: <Cpu className="h-5 w-5" /> },
    { name: 'Running Threads', status: 'ok', details: '256 active threads.', icon: <GitFork className="h-5 w-5" /> },
    { name: 'Running Processes', status: 'ok', details: '128 active processes.', icon: <Component className="h-5 w-5" /> },
  ];

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
            Note: Some of these metrics are illustrative. Real-time monitoring for hardware and low-level services requires a dedicated backend agent which is outside the scope of this web application.
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
              {healthChecks.map((check) => (
                <TableRow key={check.name}>
                  <TableCell>{check.icon}</TableCell>
                  <TableCell className="font-semibold">{check.name}</TableCell>
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

