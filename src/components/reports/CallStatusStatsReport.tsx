
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const fetchCallStatusStats = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-call-status-stats', {
        body: params
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const CallStatusStatsReport: React.FC = () => {
    const [query, setQuery] = useState({
        campaigns: '---ALL---',
        ingroups: '',
        statuses: '',
        query_date: format(new Date(), 'yyyy-MM-dd'),
    });
    const [enabled, setEnabled] = useState(false);

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['callStatusStats', query],
        queryFn: () => fetchCallStatusStats(query),
        enabled: enabled,
    });

    const handleFetchReport = () => {
        setEnabled(true);
        setTimeout(() => refetch(), 0);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000'];

    return (
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader><CardTitle>Filter Report</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="query_date">Date</Label>
                                <Input type="date" id="query_date" value={query.query_date} onChange={e => setQuery({...query, query_date: e.target.value})} />
                            </div>
                            <div>
                                <Label htmlFor="campaigns">Campaigns (dash-separated)</Label>
                                <Input id="campaigns" value={query.campaigns} onChange={e => setQuery({...query, campaigns: e.target.value})} placeholder="---ALL--- or TEST-TEST2" />
                            </div>
                            <div>
                                <Label htmlFor="ingroups">In-Groups (dash-separated)</Label>
                                <Input id="ingroups" value={query.ingroups} onChange={e => setQuery({...query, ingroups: e.target.value})} placeholder="Optional" />
                            </div>
                            <div>
                                <Label htmlFor="statuses">Statuses (dash-separated)</Label>
                                <Input id="statuses" value={query.statuses} onChange={e => setQuery({...query, statuses: e.target.value})} placeholder="Optional, e.g. SALE-DROP" />
                            </div>
                        </div>
                        <Button onClick={handleFetchReport} disabled={isLoading}>{isLoading ? 'Loading...' : 'Get Report'}</Button>
                    </CardContent>
                </Card>

                {isLoading && <Skeleton className="h-64 w-full" />}
                {isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{(error as Error).message}</AlertDescription>
                    </Alert>
                )}
                {isFetched && !isLoading && !isError && data && data.length > 0 && (
                     <div className="space-y-4">
                        {data.map((item: any, index: number) => (
                            <Card key={index}>
                                <CardHeader><CardTitle>{item.campaign_ingroup}</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Calls</p>
                                            <p className="text-2xl font-bold">{item.total_calls}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Human Answered</p>
                                            <p className="text-2xl font-bold">{item.human_answered_calls}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-semibold text-center mb-2">Status Breakdown</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie data={Object.entries(item.status_breakdown).map(([name, value]) => ({name, value}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                                        {Object.entries(item.status_breakdown).map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-center mb-2">Hourly Breakdown</h3>
                                             <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={Object.entries(item.hourly_breakdown).map(([name, value]) => ({name, value}))}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="value" fill="#82ca9d" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                {isFetched && !isLoading && !isError && (!data || data.length === 0) && (
                    <p className="p-4 text-center text-muted-foreground">No data found for the selected criteria.</p>
                )}
            </div>
        </ScrollArea>
    );
}

export default CallStatusStatsReport;
