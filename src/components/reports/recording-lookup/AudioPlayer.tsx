
import React from 'react';
import { useToast } from '@/components/ui/use-toast';

interface AudioPlayerProps {
    audioSrc: string;
    audioRef: React.RefObject<HTMLAudioElement>;
    onPlay: () => void;
    onPause: () => void;
    onEnded: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, audioRef, onPlay, onPause, onEnded }) => {
    const { toast } = useToast();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-2">
            <audio
                ref={audioRef}
                src={audioSrc}
                autoPlay
                controls
                className="w-full"
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
                onError={() => {
                    toast({
                        title: "Audio Playback Error",
                        description: "Could not play the audio file.",
                        variant: "destructive",
                    });
                    onEnded();
                }}
            />
        </div>
    );
};

export default AudioPlayer;
