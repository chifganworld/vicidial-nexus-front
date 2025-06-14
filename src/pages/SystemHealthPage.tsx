
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, DatabaseZap, CheckCircle, AlertTriangle } from 'lucide-react';

const SystemHealthPage: React.FC = () => {
  // Placeholder data
  const healthChecks = [
    { name: 'Database Connection', status: 'ok', details: 'Connected to Supabase successfully.' },
    { name: 'Vicidial API', status: 'ok', details: 'API endpoint is responsive.' },
    { name: 'SIP Server', status: 'warning', details: 'Latency detected on primary trunk.' },
    { name: 'Authentication Service', status: 'ok', details: 'Supabase Auth is operational.' },
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
      <Card className="w-full max-w-2xl">
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
          <ul className="space-y-4">
            {healthChecks.map((check) => (
              <li key={check.name} className="flex items-start p-4 border rounded-lg">
                <div className="mr-4">{getStatusIcon(check.status)}</div>
                <div>
                  <p className="font-semibold">{check.name}</p>
                  <p className="text-sm text-muted-foreground">{check.details}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthPage;
