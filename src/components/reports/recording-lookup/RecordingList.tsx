
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { AlertCircle, Play, Pause, Loader2, Download } from 'lucide-react';
import { Button } from '../../ui/button';

interface RecordingListProps {
    data: any[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isFetched: boolean;
    playAudio: (url: string) => void;
    downloadAudio: (url: string) => void;
    currentPlayingUrl: string | null;
    isAudioPlaying: boolean;
    isAudioLoading: string | null;
    isDownloading: string | null;
}

const RecordingList: React.FC<RecordingListProps> = ({
    data,
    isLoading,
    isError,
    error,
    isFetched,
    playAudio,
    downloadAudio,
    currentPlayingUrl,
    isAudioPlaying,
    isAudioLoading,
    isDownloading,
}) => {
    if (isLoading) {
        return <Skeleton className="h-64 w-full" />;
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{(error as Error).message.replace('Error: Vicidial API Error: ERROR: recording_lookup', '')}</AlertDescription>
            </Alert>
        );
    }
    
    if (isFetched && (!data || data.length === 0)) {
        return <p className="p-4 text-center text-muted-foreground">No recordings found for the selected criteria.</p>;
    }

    if (isFetched && data && data.length > 0) {
        return (
            <Card>
                <CardHeader><CardTitle>Recordings Found</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.keys(data[0]).map(key => <TableHead key={key}>{key.replace(/_/g, ' ').toUpperCase()}</TableHead>)}
                                <TableHead>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row: any, index: number) => {
                                const isCurrent = currentPlayingUrl === row.location;
                                const isLoadingAudio = isAudioLoading === row.location;
                                const isCurrentDownloading = isDownloading === row.location;
                                return (
                                    <TableRow key={index}>
                                        {Object.values(row).map((value: any, i) => <TableCell key={i}>{value}</TableCell>)}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => playAudio(row.location)} disabled={isLoadingAudio}>
                                                    {isLoadingAudio ? <Loader2 className="h-5 w-5 animate-spin" /> : (isCurrent && isAudioPlaying) ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => downloadAudio(row.location)} disabled={isCurrentDownloading}>
                                                    {isCurrentDownloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
    }

    return null;
};

export default RecordingList;
