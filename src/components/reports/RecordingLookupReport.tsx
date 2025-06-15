
import React, { useState, useRef } from 'react';
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
import { AlertCircle, Play, Pause, Loader2, Download } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';
import { useToast } from '../ui/use-toast';

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

    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [currentPlayingUrl, setCurrentPlayingUrl] = useState<string | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { toast } = useToast();

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['recordingLookup', query],
        queryFn: () => fetchRecordingLookup(query),
        enabled: false,
    });

    const handleFetchReport = () => {
        refetch();
    };
    
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    };

    const playAudio = async (url: string) => {
        if (currentPlayingUrl === url) {
            togglePlayPause();
            return;
        }

        setIsAudioLoading(url);
        setCurrentPlayingUrl(url);
        setAudioSrc(null);
        setIsAudioPlaying(false);

        try {
            const { data, error } = await supabase.functions.invoke('get-recording-audio', {
                body: { url }
            });

            if (error) {
                throw new Error(error.message);
            }
            
            if (data instanceof Blob) {
                 if (data.type === 'application/json') {
                    const errorJson = await data.text();
                    const parsedError = JSON.parse(errorJson);
                    throw new Error(parsedError.error || 'Failed to fetch audio');
                }
                const audioUrl = URL.createObjectURL(data);
                setAudioSrc(audioUrl);
            } else {
                throw new Error("Invalid audio data received");
            }

        } catch (err) {
            console.error("Error fetching audio", err);
            toast({
              title: "Error playing audio",
              description: (err as Error).message,
              variant: "destructive",
            });
            setCurrentPlayingUrl(null);
        } finally {
            setIsAudioLoading(null);
        }
    };

    const downloadAudio = async (url: string) => {
        const filename = url.split('/').pop();
        if (!filename) {
            toast({
                title: "Could not determine filename",
                variant: "destructive"
            });
            return;
        }
        
        setIsDownloading(url);

        try {
            const { data: blob, error } = await supabase.functions.invoke('get-recording-audio', {
                body: { url }
            });

            if (error) {
                throw new Error(error.message);
            }
            
            if (blob instanceof Blob) {
                if (blob.type === 'application/json') {
                    const errorJson = await blob.text();
                    const parsedError = JSON.parse(errorJson);
                    throw new Error(parsedError.error || 'Failed to fetch audio for download');
                }
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            } else {
                throw new Error("Invalid audio data received for download");
            }
        } catch (err) {
            console.error("Error downloading audio", err);
            toast({
              title: "Error downloading audio",
              description: (err as Error).message,
              variant: "destructive",
            });
        } finally {
            setIsDownloading(null);
        }
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
                )}
                 {isFetched && !isLoading && !isError && (!data || data.length === 0) && (
                    <p className="p-4 text-center text-muted-foreground">No recordings found for the selected criteria.</p>
                )}
            </div>
             {audioSrc && (
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-2">
                    <audio 
                        ref={audioRef}
                        src={audioSrc} 
                        autoPlay
                        controls
                        className="w-full"
                        onPlay={() => setIsAudioPlaying(true)}
                        onPause={() => setIsAudioPlaying(false)}
                        onEnded={() => {
                            setIsAudioPlaying(false);
                            setCurrentPlayingUrl(null);
                            setAudioSrc(null);
                        }}
                        onError={() => {
                            toast({
                              title: "Audio Playback Error",
                              description: "Could not play the audio file.",
                              variant: "destructive",
                            });
                            setIsAudioPlaying(false);
                            setCurrentPlayingUrl(null);
                            setAudioSrc(null);
                        }}
                    />
                </div>
            )}
        </ScrollArea>
    );
}

export default RecordingLookupReport;
