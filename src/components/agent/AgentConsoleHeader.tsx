
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PhoneOff, Pause } from 'lucide-react';

interface AgentConsoleHeaderProps {
  formattedCurrentSessionTime: string;
  formattedTotalBreakTime: string;
  formattedTotalSessionTime: string;
  isPaused: boolean;
  onEndSession: () => void;
  onTogglePause: () => void;
}

const AgentConsoleHeader: React.FC<AgentConsoleHeaderProps> = ({
  formattedCurrentSessionTime,
  formattedTotalBreakTime,
  formattedTotalSessionTime,
  isPaused,
  onEndSession,
  onTogglePause,
}) => {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Agent Console</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 flex items-center gap-4 border-r pr-4">
            <span>Session: {formattedCurrentSessionTime}</span>
            <span>Break: {formattedTotalBreakTime}</span>
            <span>Total Today: {formattedTotalSessionTime}</span>
          </div>
          <Button variant="destructive" onClick={onEndSession}>
            <PhoneOff className="mr-2 h-4 w-4" /> End Session
          </Button>
          <Button variant={isPaused ? "default" : "outline"} onClick={onTogglePause}>
            <Pause className="mr-2 h-4 w-4" /> {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AgentConsoleHeader;
