
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

const fetchCampaignsList = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-campaigns-list', {
        body: params
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const CampaignsListReport = () => {
    const [query, setQuery] = useState({
        campaign_id: '',
    });

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['campaignsList', query],
        queryFn: () => fetchCampaignsList(query),
        enabled: false,
    });

    const handleFetchReport = () => {
        refetch();
    };

    return (
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="campaign_id">Campaign ID (optional)</Label>
                            <Input id="campaign_id" value={query.campaign_id} onChange={e => setQuery({ ...query, campaign_id: e.target.value })} placeholder="Leave blank for all campaigns" />
                        </div>
                        <Button onClick={handleFetchReport} disabled={isLoading}>
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
                         <CardHeader><CardTitle>Campaigns List</CardTitle></CardHeader>
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

export default CampaignsListReport;
