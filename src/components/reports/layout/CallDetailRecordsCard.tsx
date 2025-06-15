
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FileText } from 'lucide-react';
import DidLogExportReport from '@/components/reports/DidLogExportReport';
import PhoneNumberLogReport from '@/components/reports/PhoneNumberLogReport';
import CallDispositionReport from '@/components/reports/CallDispositionReport';

const CallDetailRecordsCard: React.FC = () => {
    return (
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
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="mt-2 w-full">Phone Number Log</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                        <SheetHeader className="p-6">
                            <SheetTitle>Phone Number Log</SheetTitle>
                            <SheetDescription>
                                Exports list of calls placed to one or more phone numbers.
                            </SheetDescription>
                        </SheetHeader>
                        <PhoneNumberLogReport />
                    </SheetContent>
                </Sheet>
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
    );
};

export default CallDetailRecordsCard;
