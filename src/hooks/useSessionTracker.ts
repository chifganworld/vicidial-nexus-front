
import { useState, useEffect, useCallback } from 'react';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const loadInitialTime = (key: string): number => {
    const today = getTodayKey();
    if (typeof window === 'undefined') return 0;
    const storedData = localStorage.getItem(`session_stats_${today}`);
    if (storedData) {
        try {
            return JSON.parse(storedData)[key] || 0;
        } catch (e) {
            return 0;
        }
    }
    return 0;
};

export const useSessionTracker = () => {
    const [isPaused, setIsPaused] = useState(false);
    
    const [totalSessionTime, setTotalSessionTime] = useState(() => loadInitialTime('totalSessionTime'));
    const [totalBreakTime, setTotalBreakTime] = useState(() => loadInitialTime('totalBreakTime'));
    
    const [currentSessionTimer, setCurrentSessionTimer] = useState(0);

    const saveData = useCallback(() => {
        const today = getTodayKey();
        localStorage.setItem(`session_stats_${today}`, JSON.stringify({ totalSessionTime, totalBreakTime }));
    }, [totalSessionTime, totalBreakTime]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (isPaused) {
                setTotalBreakTime(prev => prev + 1);
            } else {
                setTotalSessionTime(prev => prev + 1);
                setCurrentSessionTimer(prev => prev + 1);
            }
        }, 1000);

        window.addEventListener('beforeunload', saveData);

        return () => {
            clearInterval(timer);
            window.removeEventListener('beforeunload', saveData);
            saveData();
        };
    }, [isPaused, saveData]);
    
    useEffect(() => {
        const saveInterval = setInterval(saveData, 15000);
        return () => clearInterval(saveInterval);
    }, [saveData]);


    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    const endSession = useCallback(() => {
        saveData();
    }, [saveData]);

    const formatDuration = (totalSeconds: number) => {
        if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return {
        isPaused,
        togglePause,
        endSession,
        formattedCurrentSessionTime: formatDuration(currentSessionTimer),
        formattedTotalBreakTime: formatDuration(totalBreakTime),
        formattedTotalSessionTime: formatDuration(totalSessionTime),
    };
};
