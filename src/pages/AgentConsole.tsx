
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import DialPad from '@/components/DialPad';
import LeadInfoDisplay from '@/components/LeadInfoDisplay';
import AgentStatsDisplay from '@/components/AgentStatsDisplay';
import AddLeadModal from '@/components/AddLeadModal';
import UpdateLeadModal from '@/components/UpdateLeadModal';
import SearchLeadModal from '@/components/SearchLeadModal';
import ViewCallbacksModal from '@/components/ViewCallbacksModal';
import StatsBar from '@/components/agent/StatsBar';
import CallLogs from '@/components/agent/CallLogs';

const AgentConsole: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Agent Console</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      <StatsBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dialer</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <DialPad />
          </CardContent>
        </Card>

        <LeadInfoDisplay />

        <AgentStatsDisplay />

        <CallLogs />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <AddLeadModal />
          <UpdateLeadModal />
          <SearchLeadModal />
          <ViewCallbacksModal />
        </div>
      </div>
    </div>
  );
};

export default AgentConsole;
