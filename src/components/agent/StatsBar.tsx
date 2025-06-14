import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, PhoneMissed, PhoneOff, PhoneIncoming, PhoneForwarded } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import StatDetailsSheet from './StatDetailsSheet';

const fetchAgentCallStats = async () => {
  const { data, error } = await supabase.rpc('get_agent_call_stats');

  if (error) {
    console.error('Error fetching agent call stats:', error);
    throw new Error(error.message);
  }

  // The RPC function returns data with status_name and status_count.
  // We need to ensure it matches the expected type.
  return data as { status_name: string; status_count: number }[];
};

const iconMap: { [key: string]: React.ReactElement } = {
  ANSWERED: <Phone className="h-6 w-6 text-green-500" />,
  ABANDONED: <PhoneOff className="h-6 w-6 text-red-500" />,
  IN_QUEUE: <PhoneIncoming className="h-6 w-6 text-yellow-500" />,
  MISSED: <PhoneMissed className="h-6 w-6 text-orange-500" />,
  FAILED: <PhoneForwarded className="h-6 w-6 text-purple-500" />,
};

const titleMap: { [key: string]: string } = {
  ANSWERED: 'Answered Calls',
  ABANDONED: 'Abandoned Calls',
  IN_QUEUE: 'Calls in Queue',
  MISSED: 'Missed Calls',
  FAILED: 'Failed Calls',
};

const StatsBar: React.FC = () => {
  const { toast } = useToast();
  const { data: statsData, isLoading, isError, error } = useQuery({
    queryKey: ['agentCallStats'],
    queryFn: fetchAgentCallStats,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  React.useEffect(() => {
    if (isError) {
      toast({
        title: "Error fetching agent stats",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Error Loading Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Could not load agent stats at this time.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = ['ANSWERED', 'ABANDONED', 'IN_QUEUE', 'MISSED', 'FAILED'];
  
  const sortedStatsData = statsData ? [...statsData].sort((a, b) => {
    const aIndex = order.indexOf(a.status_name);
    const bIndex = order.indexOf(b.status_name);
    // Put unknown statuses at the end
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  }) : [];

  const stats = sortedStatsData.map((stat) => ({
    title: titleMap[stat.status_name] || stat.status_name,
    value: stat.status_count.toString(),
    icon: iconMap[stat.status_name] || <Phone className="h-6 w-6 text-gray-500" />,
    statusName: stat.status_name,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
      {stats.map((stat) => (
        <StatDetailsSheet key={stat.title} statusName={stat.statusName} statusTitle={stat.title}>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </StatDetailsSheet>
      ))}
    </div>
  );
};

export default StatsBar;
