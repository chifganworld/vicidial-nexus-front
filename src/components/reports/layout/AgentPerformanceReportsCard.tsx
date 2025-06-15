
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Users } from 'lucide-react';
import AgentStatsExportReport from '@/components/reports/AgentStatsExportReport';

const AgentPerformanceReportsCard: React.FC = () => {
    return (
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
    );
};

export default AgentPerformanceReportsCard;
