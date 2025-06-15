
import { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useRecordingPlayback = () => {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [currentPlayingUrl, setCurrentPlayingUrl] = useState<string | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { toast } = useToast();

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

    return {
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
    };
};
