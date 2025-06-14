
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Eye } from 'lucide-react';
import AgentStatusGrid from '@/components/supervisor/AgentStatusGrid';

const SupervisorDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
          <Link to="/agent">
            <Button variant="outline">Back to Agent Console</Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AgentStatusGrid />
        </div>
        
        <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Campaign Performance</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Live Metrics</div>
                <p className="text-xs text-muted-foreground">
                  Track campaign and in-group statistics.
                </p>
                <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 text-center">
                  Campaign Stats (Coming Soon)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blind Monitoring</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Call Monitoring</div>
                <p className="text-xs text-muted-foreground">
                  Listen in or barge into live calls.
                </p>
                <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 text-center">
                  Monitoring Tools (Coming Soon)
                </div>
              </CardContent>
            </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Supervisor Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild><Link to="/reports">View Agent Stats</Link></Button>
          <Button asChild><Link to="/settings/users">Manage Users</Link></Button>
          <Button asChild><Link to="/settings">Campaign Settings</Link></Button>
          <Button disabled>View Hopper</Button>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
