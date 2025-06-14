
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

const fetchAgentStatsExport = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-agent-stats-export', {
        body: params
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const AgentStatsExportReport = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: new Date(),
    });
    const [query, setQuery] = useState({
        agent_user: '',
        campaign_id: '',
        time_format: 'HF',
        group_by_campaign: false,
    });
    const [enabled, setEnabled] = useState(false);

    const reportParams = {
        agent_user: query.agent_user || undefined,
        campaign_id: query.campaign_id || undefined,
        time_format: query.time_format,
        group_by_campaign: query.group_by_campaign ? 'YES' : 'NO',
        datetime_start: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd HH:mm:ss') : undefined,
        datetime_end: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd HH:mm:ss') : undefined,
    };

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['agentStatsExport', reportParams],
        queryFn: () => fetchAgentStatsExport(reportParams),
        enabled: enabled,
    });

    const handleFetchReport = () => {
        setEnabled(true);
        // This is a manual refetch trigger
        setTimeout(() => refetch(), 0);
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
                            <Label>Date Range</Label>
                            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
                        </div>
                        <div>
                            <Label htmlFor="agent_user">Agent User (optional)</Label>
                            <Input id="agent_user" value={query.agent_user} onChange={e => setQuery({...query, agent_user: e.target.value})} placeholder="e.g., 1001" />
                        </div>
                        <div>
                            <Label htmlFor="campaign_id">Campaign ID (optional)</Label>
                            <Input id="campaign_id" value={query.campaign_id} onChange={e => setQuery({...query, campaign_id: e.target.value})} placeholder="e.g., TESTCAMP" />
                        </div>
                        <div>
                            <Label htmlFor="time_format">Time Format</Label>
                             <Select onValueChange={(value) => setQuery({...query, time_format: value})} defaultValue={query.time_format}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="H">Hours (1:23:45)</SelectItem>
                                    <SelectItem value="HF">Hours Force (0:00:00)</SelectItem>
                                    <SelectItem value="M">Minutes (83:45)</SelectItem>
                                    <SelectItem value="S">Seconds (5023)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                             <Switch id="group_by_campaign" checked={query.group_by_campaign} onCheckedChange={checked => setQuery({...query, group_by_campaign: checked})} />
                             <Label htmlFor="group_by_campaign">Group by Campaign</Label>
                        </div>
                    </div>
                    <Button onClick={handleFetchReport} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Get Report'}
                    </Button>
                </CardContent>
            </Card>

            {isLoading && (
                <div className="space-y-2">
                    <Skeleton className="h-64 w-full" />
                </div>
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
                     <CardHeader><CardTitle>Agent Stats</CardTitle></CardHeader>
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

export default AgentStatsExportReport;
