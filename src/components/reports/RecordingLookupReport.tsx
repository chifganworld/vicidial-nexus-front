
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, PlayCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';

const fetchRecordingLookup = async (params: any) => {
    const { data, error } = await supabase.functions.invoke('get-recording-lookup', {
        body: params
    });

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

const RecordingLookupReport: React.FC = () => {
    const [query, setQuery] = useState({
        agent_user: '',
        lead_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        uniqueid: '',
        extension: '',
        duration: false,
    });
    const [enabled, setEnabled] = useState(false);

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['recordingLookup', query],
        queryFn: () => fetchRecordingLookup(query),
        enabled: enabled,
    });

    const handleFetchReport = () => {
        setEnabled(true);
        setTimeout(() => refetch(), 0);
    };
    
    const playAudio = (url: string) => {
        const audio = new Audio(url);
        audio.play();
    };

    return (
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4 p-6">
                <Card>
                    <CardHeader><CardTitle>Filter Report</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">At least one search parameter is required.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input type="date" id="date" value={query.date} onChange={e => setQuery({...query, date: e.target.value})} />
                            </div>
                            <div>
                                <Label htmlFor="agent_user">Agent User</Label>
                                <Input id="agent_user" value={query.agent_user} onChange={e => setQuery({...query, agent_user: e.target.value})} placeholder="e.g., 1001" />
                            </div>
                            <div>
                                <Label htmlFor="lead_id">Lead ID</Label>
                                <Input id="lead_id" value={query.lead_id} onChange={e => setQuery({...query, lead_id: e.target.value})} placeholder="e.g., 12345" />
                            </div>
                            <div>
                                <Label htmlFor="uniqueid">Unique ID</Label>
                                <Input id="uniqueid" value={query.uniqueid} onChange={e => setQuery({...query, uniqueid: e.target.value})} placeholder="e.g., 16..." />
                            </div>
                             <div>
                                <Label htmlFor="extension">Extension</Label>
                                <Input id="extension" value={query.extension} onChange={e => setQuery({...query, extension: e.target.value})} placeholder="e.g., 8368" />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                 <Switch id="duration" checked={query.duration} onCheckedChange={checked => setQuery({...query, duration: checked})} />
                                 <Label htmlFor="duration">Include Duration</Label>
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
                        <AlertDescription>{(error as Error).message.replace('Error: Vicidial API Error: ERROR: recording_lookup', '')}</AlertDescription>
                    </Alert>
                )}
                {isFetched && !isLoading && !isError && data && data.length > 0 && (
                    <Card>
                         <CardHeader><CardTitle>Recordings Found</CardTitle></CardHeader>
                         <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Object.keys(data[0]).map(key => <TableHead key={key}>{key.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                                        <TableHead>PLAY</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((row: any, index: number) => (
                                        <TableRow key={index}>
                                            {Object.values(row).map((value: any, i) => {
                                                const key = Object.keys(row)[i];
                                                if (key === 'location') {
                                                    return <TableCell key={i}><a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a></TableCell>
                                                }
                                                return <TableCell key={i}>{value}</TableCell>
                                            })}
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => playAudio(row.location)}>
                                                    <PlayCircle className="h-5 w-5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </CardContent>
                    </Card>
                )}
                 {isFetched && !isLoading && !isError && (!data || data.length === 0) && (
                    <p className="p-4 text-center text-muted-foreground">No recordings found for the selected criteria.</p>
                )}
            </div>
        </ScrollArea>
    );
}

export default RecordingLookupReport;
