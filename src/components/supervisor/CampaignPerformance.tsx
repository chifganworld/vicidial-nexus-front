
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Activity, PhoneIncoming, Users, Clock, PauseCircle } from 'lucide-react'

type InGroupStatus = {
  ingroups: string;
  total_calls: string;
  calls_waiting: string;
  agents_logged_in: string;
  agents_in_calls: string;
  agents_waiting: string;
  agents_paused: string;
  agents_in_dispo: string;
  agents_in_dial: string;
};

const fetchInGroupStatus = async (): Promise<InGroupStatus[]> => {
  const { data, error } = await supabase.functions.invoke('get-in-group-status', {
    body: { in_groups: 'SALESLINE|SUPPORT|AGENTDIRECT' } // Using common example groups
  })

  if (error) {
    console.error('Error fetching in-group status:', error);
    try {
        const errorData = await error.context.json();
        throw new Error(errorData?.error || error.message);
    } catch (e) {
        throw new Error(error.message);
    }
  }
  return data
}

const CampaignPerformance: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<InGroupStatus[], Error>({
    queryKey: ['inGroupStatus'],
    queryFn: fetchInGroupStatus,
    refetchInterval: 5000,
  })

  const summary = data?.[0]; // Vicidial API often returns a summary line first

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Campaign Performance</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Live Metrics</div>
        <p className="text-xs text-muted-foreground">
          Real-time in-group statistics.
        </p>
        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          )}
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error?.message || "Could not load campaign stats."}
              </AlertDescription>
            </Alert>
          )}
          {summary && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-3">
                <PhoneIncoming className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Calls Waiting</p>
                  <p className="font-bold text-lg">{summary.calls_waiting}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Agents in Calls</p>
                  <p className="font-bold text-lg">{summary.agents_in_calls}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Agents Waiting</p>
                  <p className="font-bold text-lg">{summary.agents_waiting}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PauseCircle className="h-5 w-5 text-orange-500" />
                 <div>
                  <p className="text-sm text-muted-foreground">Agents Paused</p>
                  <p className="font-bold text-lg">{summary.agents_paused}</p>
                </div>
              </div>
            </div>
          )}
           {!isLoading && !isError && !summary && (
             <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 text-center">
              No campaign data found. Check if the in-groups (e.g., SALESLINE, SUPPORT) exist and are active.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CampaignPerformance;
