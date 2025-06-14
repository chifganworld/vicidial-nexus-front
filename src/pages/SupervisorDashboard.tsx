
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AgentStatusGrid from '@/components/supervisor/AgentStatusGrid';
import CampaignPerformance from '@/components/supervisor/CampaignPerformance';
import { useDisplaySettings } from '@/contexts/DisplaySettingsContext';
import SupervisorTools from '@/components/supervisor/SupervisorTools';

const SupervisorDashboard: React.FC = () => {
  const { settings } = useDisplaySettings();

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
            {settings.showCampaignPerformance && <CampaignPerformance />}
        </div>
      </div>

      <div className="mt-8">
        <SupervisorTools />
      </div>
    </div>
  );
};

export default SupervisorDashboard;
