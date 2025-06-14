
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const fetchAgentLeadStats = async () => {
  const { data, error } = await supabase.rpc('get_agent_lead_stats').single();
  if (error) {
    console.error("Error fetching lead stats:", error);
    throw new Error(error.message);
  }
  return data;
};

const fetchAgentWeeklyCallStats = async () => {
  const { data, error } = await supabase.rpc('get_agent_weekly_call_stats');
  if (error) {
    console.error("Error fetching weekly call stats:", error);
    throw new Error(error.message);
  }
  return data;
};

const formatSeconds = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return '0m 0s';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

const AgentPerformance: React.FC = () => {
    const { toast } = useToast();

    const { data: leadStats, isLoading: isLoadingLeadStats, isError: isErrorLeadStats, error: leadStatsError } = useQuery({
        queryKey: ['agentLeadStats'],
        queryFn: fetchAgentLeadStats,
        refetchInterval: 10000,
    });

    const { data: weeklyCallStats, isLoading: isLoadingWeeklyCallStats, isError: isErrorWeeklyCallStats, error: weeklyCallStatsError } = useQuery({
        queryKey: ['agentWeeklyCallStats'],
        queryFn: fetchAgentWeeklyCallStats,
        refetchInterval: 10000,
    });

    React.useEffect(() => {
        if (isErrorLeadStats) {
        toast({ title: "Error fetching lead stats", description: leadStatsError?.message, variant: "destructive" });
        }
        if (isErrorWeeklyCallStats) {
        toast({ title: "Error fetching weekly call stats", description: weeklyCallStatsError?.message, variant: "destructive" });
        }
    }, [isErrorLeadStats, leadStatsError, isErrorWeeklyCallStats, weeklyCallStatsError, toast]);

    const agentStatsData = [
        { name: 'New Leads Today', value: leadStats?.new_leads_today ?? 0 },
        { name: 'Leads In Progress', value: leadStats?.leads_in_progress ?? 0 },
        { name: 'Leads Converted', value: leadStats?.leads_converted ?? 0 },
        { name: 'Average Handle Time', value: formatSeconds(leadStats?.avg_handle_time_seconds) },
    ];

    const chartData = weeklyCallStats?.map(stat => ({
        name: stat.day_of_week,
        calls: stat.calls_count,
    }));
    
    const isLoading = isLoadingLeadStats || isLoadingWeeklyCallStats;

    if (isLoading) {
        return (
          <Card className="h-full bg-green-950/20 backdrop-blur-md border-green-400/20 shadow-lg shadow-green-400/20">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-md shadow-sm">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                    ))}
                </div>
                <div className="h-48">
                    <Skeleton className="h-full w-full" />
                </div>
            </CardContent>
          </Card>
        );
      }
    
    return (
        <Card className="h-full bg-green-950/20 backdrop-blur-md border-green-400/20 shadow-lg shadow-green-400/20">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Your current lead statistics.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {agentStatsData.map((stat) => (
                  <div key={stat.name} className="p-3 bg-gray-50 rounded-md shadow-sm">
                    <p className="text-xs text-muted-foreground">{stat.name}</p>
                    <p className="text-base font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="calls" fill="#8884d8" name="Calls" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
        </CardContent>
      </Card>
    );
}

export default AgentPerformance;
