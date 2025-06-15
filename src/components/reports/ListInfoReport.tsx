
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const fetchListInfo = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-list-info', {
        body: params
    });

    if (error) {
        try {
            const errorBody = await error.context.json();
            throw new Error(errorBody.error || error.message);
        } catch {
            throw new Error(error.message);
        }
    }
    return data;
}

const ListInfoReport: React.FC = () => {
    const [query, setQuery] = useState({
        list_id: '',
        leads_counts: false,
        dialable_count: false,
        archived_lead: false,
    });

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['listInfo', query],
        queryFn: () => fetchListInfo(query),
        enabled: false,
    });

    const handleFetchReport = () => {
        if (query.list_id) {
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
                                <Label htmlFor="list_id">List ID</Label>
                                <Input id="list_id" value={query.list_id} onChange={e => setQuery({ ...query, list_id: e.target.value })} placeholder="e.g., 101" />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                 <Switch id="leads_counts" checked={query.leads_counts} onCheckedChange={checked => setQuery({...query, leads_counts: checked})} />
                                 <Label htmlFor="leads_counts">Include Leads Counts</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                 <Switch id="dialable_count" checked={query.dialable_count} onCheckedChange={checked => setQuery({...query, dialable_count: checked})} />
                                 <Label htmlFor="dialable_count">Include Dialable Count</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                 <Switch id="archived_lead" checked={query.archived_lead} onCheckedChange={checked => setQuery({...query, archived_lead: checked})} />
                                 <Label htmlFor="archived_lead">Include Archived Leads</Label>
                            </div>
                        </div>
                        <Button onClick={handleFetchReport} disabled={isLoading || !query.list_id}>
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
                        <AlertDescription>{(error as Error).message.replace('Error: Vicidial API Error: ERROR: list_info', '')}</AlertDescription>
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

export default ListInfoReport;
