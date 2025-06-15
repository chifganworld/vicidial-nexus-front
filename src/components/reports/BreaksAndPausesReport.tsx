
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from '../ui/date-range-picker';
import { subDays } from 'date-fns';

const fetchAgentStats = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-agent-stats-export', {
        body: params
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const BreaksAndPausesReport: React.FC = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
      });

    const reportParams = {
        datetime_start: dateRange?.from?.toISOString(),
        datetime_end: dateRange?.to?.toISOString(),
        time_format: 'S', // Get time in seconds
    };

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['agentStatsBreaks', reportParams],
        queryFn: () => fetchAgentStats(reportParams),
        enabled: false,
    });

    const handleFetchReport = () => {
        if (dateRange?.from && dateRange?.to) {
            refetch();
        }
    };

    const formatSeconds = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) return '00:00:00';
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (Math.round(seconds) % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    const pauseColumns = ['user', 'full_name', 'pause_time', 'pauses', 'avg_pause_time', 'pause_pct'];

    return (
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
                            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
                        </div>
                        <Button onClick={handleFetchReport} disabled={isLoading || !dateRange?.from || !dateRange?.to}>
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
                                        {pauseColumns.map(key => <TableHead key={key}>{key.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((row: any, index: number) => (
                                        <TableRow key={index}>
                                            {pauseColumns.map((key) => (
                                                <TableCell key={key}>
                                                    {key.includes('_time') ? formatSeconds(Number(row[key])) : row[key]}
                                                </TableCell>
                                            ))}
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

export default BreaksAndPausesReport;
