
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecordingFilterFormProps {
    query: {
        agent_user: string;
        lead_id: string;
        date: string;
        uniqueid: string;
        extension: string;
        duration: boolean;
    };
    setQuery: React.Dispatch<React.SetStateAction<any>>;
    onFetchReport: () => void;
    isLoading: boolean;
}

const RecordingFilterForm: React.FC<RecordingFilterFormProps> = ({ query, setQuery, onFetchReport, isLoading }) => {
    return (
        <Card>
            <CardHeader><CardTitle>Filter Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">At least one search parameter is required.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input type="date" id="date" value={query.date} onChange={e => setQuery({ ...query, date: e.target.value })} />
                    </div>
                    <div>
                        <Label htmlFor="agent_user">Agent User</Label>
                        <Input id="agent_user" value={query.agent_user} onChange={e => setQuery({ ...query, agent_user: e.target.value })} placeholder="e.g., 1001" />
                    </div>
                    <div>
                        <Label htmlFor="lead_id">Lead ID</Label>
                        <Input id="lead_id" value={query.lead_id} onChange={e => setQuery({ ...query, lead_id: e.target.value })} placeholder="e.g., 12345" />
                    </div>
                    <div>
                        <Label htmlFor="uniqueid">Unique ID</Label>
                        <Input id="uniqueid" value={query.uniqueid} onChange={e => setQuery({ ...query, uniqueid: e.target.value })} placeholder="e.g., 16..." />
                    </div>
                    <div>
                        <Label htmlFor="extension">Extension</Label>
                        <Input id="extension" value={query.extension} onChange={e => setQuery({ ...query, extension: e.target.value })} placeholder="e.g., 8368" />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <Switch id="duration" checked={query.duration} onCheckedChange={checked => setQuery({ ...query, duration: checked })} />
                        <Label htmlFor="duration">Include Duration</Label>
                    </div>
                </div>
                <Button onClick={onFetchReport} disabled={isLoading}>{isLoading ? 'Loading...' : 'Get Report'}</Button>
            </CardContent>
        </Card>
    );
};

export default RecordingFilterForm;
