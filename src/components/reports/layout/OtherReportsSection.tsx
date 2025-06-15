
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import RecordingLookupReport from '@/components/reports/RecordingLookupReport';
import ListInfoReport from '@/components/reports/ListInfoReport';
import CampaignsListReport from '@/components/reports/CampaignsListReport';

const OtherReportsSection: React.FC = () => {
    return (
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
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">List Info</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                        <SheetHeader className="p-6">
                            <SheetTitle>List Info</SheetTitle>
                            <SheetDescription>
                                Summary information about a list.
                            </SheetDescription>
                        </SheetHeader>
                        <ListInfoReport />
                    </SheetContent>
                </Sheet>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">Campaigns List</Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-full md:w-3/4 lg:w-2/3 xl:w-1/2 p-0">
                        <SheetHeader className="p-6">
                            <SheetTitle>Campaigns List</SheetTitle>
                            <SheetDescription>
                                Displays information about all campaigns in the system.
                            </SheetDescription>
                        </SheetHeader>
                        <CampaignsListReport />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default OtherReportsSection;
