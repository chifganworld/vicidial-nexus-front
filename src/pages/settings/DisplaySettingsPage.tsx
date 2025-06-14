
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MonitorPlay, ArrowLeft } from 'lucide-react';

const DisplaySettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="text-center">
        <MonitorPlay className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Display Settings</h1>
        <p className="text-xl text-gray-600 mb-8">
          This section is under construction. Check back soon!
        </p>
        <Link to="/settings">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DisplaySettingsPage;
