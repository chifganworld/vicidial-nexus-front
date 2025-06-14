
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const fetchCallDispoReport = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-call-dispo-report', {
        body: params
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const CallDispositionReport = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: new Date(),
    });
    const [query, setQuery] = useState({
        campaigns: '',
        ingroups: '',
        dids: '',
    });
    const [enabled, setEnabled] = useState(false);

    const reportParams = {
        ...query,
        query_date: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
        end_date: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    };

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['callDispoReport', reportParams],
        queryFn: () => fetchCallDispoReport(reportParams),
        enabled: enabled,
    });

    const handleFetchReport = () => {
        if (!query.campaigns && !query.ingroups && !query.dids) {
            alert('Please provide at least one campaign, in-group, or DID.');
            return;
        }
        setEnabled(true);
        refetch();
    };

    const chartData = data?.slice(0, -1).map((row: any) => {
        const name = row.CAMPAIGN;
        const usefulData = { ...row };
        delete usefulData.CAMPAIGN;
        delete usefulData['TOTAL CALLS'];

        const chartRow: any = { name };
        for (const key in usefulData) {
            const val = parseInt(usefulData[key].split(' ')[0])
            if (!isNaN(val)) {
                chartRow[key] = val
            }
        }
        return chartRow;
    });

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
                            <Label htmlFor="campaigns">Campaigns (dash-separated)</Label>
                            <Input id="campaigns" value={query.campaigns} onChange={e => setQuery({...query, campaigns: e.target.value})} placeholder="TESTCAMP-TESTCAMP2" />
                        </div>
                        <div>
                            <Label htmlFor="ingroups">In-Groups (dash-separated)</Label>
                            <Input id="ingroups" value={query.ingroups} onChange={e => setQuery({...query, ingroups: e.target.value})} placeholder="SALESLINE-SUPPORT" />
                        </div>
                        <div>
                            <Label htmlFor="dids">DIDs (dash-separated)</Label>
                            <Input id="dids" value={query.dids} onChange={e => setQuery({...query, dids: e.target.value})} placeholder="7275551212-3125551212" />
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
                    <Skeleton className="h-48 w-full" />
                </div>
            )}

            {isError && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{(error as Error).message}</AlertDescription>
                </Alert>
            )}

            {data && data.length > 0 && (
                <>
                    <Card>
                        <CardHeader><CardTitle>Chart</CardTitle></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {chartData && chartData.length > 0 && Object.keys(chartData[0]).filter(k => k !== 'name').map((key, index) => (
                                        <Bar key={key} dataKey={key} stackId="a" fill={`hsl(${index * 40}, 70%, 50%)`} />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader><CardTitle>Data</CardTitle></CardHeader>
                         <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Object.keys(data[0]).map(key => <TableHead key={key}>{key}</TableHead>)}
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
                </>
            )}
             {data && data.length === 0 && (
                <p className="p-4 text-center text-muted-foreground">No data found for the selected criteria.</p>
            )}
        </div>
        </ScrollArea>
    );
};

export default CallDispositionReport;
