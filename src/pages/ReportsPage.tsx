
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartBig, FileText, PhoneIncoming } from 'lucide-react';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Performance Reports</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Detailed statistics for agent activity and performance.
            </p>
            <Button className="mt-4 w-full">View Agent Stats Export</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Detail Records (CDR)</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Access logs for DIDs, phone numbers, and call dispositions.
            </p>
            <Button className="mt-2 w-full">DID Log Export</Button>
            <Button className="mt-2 w-full">Phone Number Log</Button>
            <Button className="mt-2 w-full">Call Dispo Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign & In-Group Reports</CardTitle>
            <BarChartBig className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Statistics on campaign calls and status breakdowns.
            </p>
            <Button className="mt-4 w-full">Call Status Stats</Button>
          </CardContent>
        </Card>
      </div>
      {/* More report types can be added here */}
       <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Other Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Placeholder for other report links */}
          <Button variant="outline">Recording Lookup</Button>
          <Button variant="outline">List Info</Button>
          <Button variant="outline">Custom Reports (TBD)</Button>
        </div>
      </div>
    </div>
  );
};

// Need to import Users icon
import { Users } from 'lucide-react';

export default ReportsPage;
