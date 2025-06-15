
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { useRecordingPlayback } from './recording-lookup/useRecordingPlayback';
import AudioPlayer from './recording-lookup/AudioPlayer';
import RecordingFilterForm from './recording-lookup/RecordingFilterForm';
import RecordingList from './recording-lookup/RecordingList';

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

    const {
        audioSrc,
        setAudioSrc,
        currentPlayingUrl,
        setCurrentPlayingUrl,
        isAudioLoading,
        isDownloading,
        isAudioPlaying,
        setIsAudioPlaying,
        audioRef,
        playAudio,
        downloadAudio
    } = useRecordingPlayback();

    const { data, isLoading, isError, error, refetch, isFetched } = useQuery({
        queryKey: ['recordingLookup', query],
        queryFn: () => fetchRecordingLookup(query),
        enabled: false,
    });

    const handleFetchReport = () => {
        refetch();
    };

    const handleAudioEnded = () => {
        setIsAudioPlaying(false);
        setCurrentPlayingUrl(null);
        setAudioSrc(null);
    };

    return (
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-4 p-6">
                <RecordingFilterForm
                    query={query}
                    setQuery={setQuery}
                    onFetchReport={handleFetchReport}
                    isLoading={isLoading}
                />

                <RecordingList
                    data={data}
                    isLoading={isLoading}
                    isError={isError}
                    error={error as Error}
                    isFetched={isFetched}
                    playAudio={playAudio}
                    downloadAudio={downloadAudio}
                    currentPlayingUrl={currentPlayingUrl}
                    isAudioPlaying={isAudioPlaying}
                    isAudioLoading={isAudioLoading}
                    isDownloading={isDownloading}
                />
            </div>
             {audioSrc && (
                <AudioPlayer
                    audioSrc={audioSrc}
                    audioRef={audioRef}
                    onPlay={() => setIsAudioPlaying(true)}
                    onPause={() => setIsAudioPlaying(false)}
                    onEnded={handleAudioEnded}
                />
            )}
        </ScrollArea>
    );
}

export default RecordingLookupReport;
