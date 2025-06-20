import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

const fetchPhoneNumberLog = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-phone-number-log', {
        body: params
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const PhoneNumberLogReport = () => {
    const [query, setQuery] = useState({
        phone_number: '',
        detail: 'ALL',
        type: 'ALL',
        archived_lead: false,
    });

    const reportParams = {
        ...query,
        archived_lead: query.archived_lead ? 'Y' : 'N',
    };

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['phoneNumberLog', reportParams],
        queryFn: () => fetchPhoneNumberLog(reportParams),
        enabled: false,
    });

    const handleFetchReport = () => {
        if (query.phone_number) {
            refetch();
        }
    };

    return (
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone_number">Phone Number(s) (comma-separated)</Label>
                                <Input id="phone_number" value={query.phone_number} onChange={e => setQuery({ ...query, phone_number: e.target.value })} placeholder="e.g., 3125551212,9998887112" />
                            </div>
                            <div>
                                <Label htmlFor="detail">Detail</Label>
                                <Select onValueChange={(value) => setQuery({...query, detail: value})} defaultValue={query.detail}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select detail level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Calls</SelectItem>
                                        <SelectItem value="LAST">Last Call</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="type">Call Type</Label>
                                <Select onValueChange={(value) => setQuery({...query, type: value})} defaultValue={query.type}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select call type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All</SelectItem>
                                        <SelectItem value="IN">Inbound</SelectItem>
                                        <SelectItem value="OUT">Outbound</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                 <Switch id="archived_lead" checked={query.archived_lead} onCheckedChange={checked => setQuery({...query, archived_lead: checked})} />
                                 <Label htmlFor="archived_lead">Search in Archived Leads</Label>
                            </div>
                        </div>
                        <Button onClick={handleFetchReport} disabled={isLoading || !query.phone_number}>
                            {isLoading ? 'Loading...' : 'Get Report'}
                        </Button>
                    </CardContent>
                </Card>

                {isLoading && (
                    <Card>
                        <CardHeader><CardTitle>Report Results</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isError && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{(error as Error).message}</AlertDescription>
                    </Alert>
                )}

                {isFetched && !isLoading && !isError && data && data.length > 0 && (
                    <Card>
                         <CardHeader><CardTitle>Report Results</CardTitle></CardHeader>
                         <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Object.keys(data[0]).map(key => <TableHead key={key}>{key.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((row: any, index: number) => (
                                        <TableRow key={index}>
                                            {Object.values(row).map((value: any, i) => <TableCell key={i}>{value}</TableCell>)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </CardContent>
                    </Card>
                )}
                 {isFetched && !isLoading && !isError && (!data || data.length === 0) && (
                    <p className="p-4 text-center text-muted-foreground">No data found for the selected criteria.</p>
                )}
            </div>
        </ScrollArea>
    );
};

export default PhoneNumberLogReport;
