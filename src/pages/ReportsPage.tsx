
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AgentPerformanceReportsCard from '@/components/reports/layout/AgentPerformanceReportsCard';
import CallDetailRecordsCard from '@/components/reports/layout/CallDetailRecordsCard';
import CampaignReportsCard from '@/components/reports/layout/CampaignReportsCard';
import AgentActivityReportsCard from '@/components/reports/layout/AgentActivityReportsCard';
import OtherReportsSection from '@/components/reports/layout/OtherReportsSection';

const ReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Reports Center</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AgentPerformanceReportsCard />
        <CallDetailRecordsCard />
        <CampaignReportsCard />
        <AgentActivityReportsCard />
      </div>
      
      <OtherReportsSection />
    </div>
  );
};

export default ReportsPage;
