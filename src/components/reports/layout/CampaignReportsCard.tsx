
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BarChartBig } from 'lucide-react';
import CallStatusStatsReport from '@/components/reports/CallStatusStatsReport';

const CampaignReportsCard: React.FC = () => {
    return (
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
    );
};

export default CampaignReportsCard;
