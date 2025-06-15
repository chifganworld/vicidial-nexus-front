
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartBig, FileText, Users } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CallDispositionReport from '@/components/reports/CallDispositionReport';
import AgentStatsExportReport from '@/components/reports/AgentStatsExportReport';
import CallStatusStatsReport from '@/components/reports/CallStatusStatsReport';
import RecordingLookupReport from '@/components/reports/RecordingLookupReport';
import DidLogExportReport from '@/components/reports/DidLogExportReport';

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
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="mt-4 w-full">View Agent Stats Export</Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                  <SheetHeader className="p-6">
                    <SheetTitle>Agent Stats Export</SheetTitle>
                    <SheetDescription>
                      Generate an agent statistics report from Vicidial.
                    </SheetDescription>
                  </SheetHeader>
                  <AgentStatsExportReport />
                </SheetContent>
            </Sheet>
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
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="mt-2 w-full">DID Log Export</Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                  <SheetHeader className="p-6">
                    <SheetTitle>DID Log Export</SheetTitle>
                    <SheetDescription>
                      Exports all calls inbound to a DID for one day.
                    </SheetDescription>
                  </SheetHeader>
                  <DidLogExportReport />
                </SheetContent>
            </Sheet>
            <Button className="mt-2 w-full" disabled>Phone Number Log</Button>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="mt-2 w-full">Call Dispo Report</Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                  <SheetHeader className="p-6">
                    <SheetTitle>Call Disposition Report</SheetTitle>
                    <SheetDescription>
                      Generate a call disposition breakdown report from Vicidial.
                    </SheetDescription>
                  </SheetHeader>
                  <CallDispositionReport />
                </SheetContent>
            </Sheet>
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
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="mt-4 w-full">Call Status Stats</Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                  <SheetHeader className="p-6">
                    <SheetTitle>Call Status Stats</SheetTitle>
                    <SheetDescription>
                      Report on number of calls made by campaign and ingroup, with hourly and status breakdowns.
                    </SheetDescription>
                  </SheetHeader>
                  <CallStatusStatsReport />
                </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </div>
      {/* More report types can be added here */}
       <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Other Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Sheet>
              <SheetTrigger asChild>
                  <Button variant="outline">Recording Lookup</Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                <SheetHeader className="p-6">
                  <SheetTitle>Recording Lookup</SheetTitle>
                  <SheetDescription>
                    Look up recordings based on various criteria.
                  </SheetDescription>
                </SheetHeader>
                <RecordingLookupReport />
              </SheetContent>
          </Sheet>
          <Button variant="outline" disabled>List Info</Button>
          <Button variant="outline" disabled>Custom Reports (TBD)</Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
