
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Clock } from 'lucide-react';
import PausesReport from '@/components/reports/PausesReport';
import LoginSessionReport from '@/components/reports/LoginSessionReport';

const AgentActivityReportsCard: React.FC = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agent Activity Reports</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">
                    Monitor agent pauses, logins, and session durations.
                </p>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="mt-4 w-full">View Pauses Report</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                        <SheetHeader className="p-6">
                            <SheetTitle>Pauses Report</SheetTitle>
                            <SheetDescription>
                                This report shows agent pause statistics for a selected time period.
                            </SheetDescription>
                        </SheetHeader>
                        <PausesReport />
                    </SheetContent>
                </Sheet>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="mt-2 w-full">View Login & Session Report</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                        <SheetHeader className="p-6">
                            <SheetTitle>Login & Session Report</SheetTitle>
                            <SheetDescription>
                                This report shows agent login and session duration statistics for a selected time period.
                            </SheetDescription>
                        </SheetHeader>
                        <LoginSessionReport />
                    </SheetContent>
                </Sheet>
            </CardContent>
        </Card>
    );
};

export default AgentActivityReportsCard;
