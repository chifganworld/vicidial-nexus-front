import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Users, BarChart2 } from 'lucide-react';
import DialPad from '@/components/DialPad';
import LeadInfoDisplay from '@/components/LeadInfoDisplay'; // Import the new component

const AgentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dialer</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold mb-2">Call Control</div> Removed this title as DialPad itself is descriptive */}
            <DialPad />
          </CardContent>
        </Card>

        <LeadInfoDisplay /> {/* Replace placeholder with the new component */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Stats</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Performance</div>
            <p className="text-xs text-muted-foreground">
              Your current session statistics.
            </p>
            {/* Placeholder for Stats Component */}
            <div className="mt-4 p-4 border rounded-md bg-gray-50 text-center">
              Agent Stats (Coming Soon)
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button>Add Lead</Button>
          <Button>Update Lead</Button>
          <Button>Search Lead</Button>
          <Button>View Callbacks</Button>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
