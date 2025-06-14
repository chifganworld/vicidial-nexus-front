
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type AgentStatus = {
  user: string;
  campaign_id: string;
  status: string;
  calls_today: string;
  full_name: string;
  user_group: string;
  pause_code: string;
  sub_status: string;
};

const fetchAgentStatuses = async (): Promise<AgentStatus[]> => {
  const { data, error } = await supabase.functions.invoke('get-agent-statuses')

  if (error) {
    console.error('Error fetching agent statuses:', error);
    try {
        const errorData = await error.context.json();
        throw new Error(errorData?.error || error.message);
    } catch (e) {
        throw new Error(error.message);
    }
  }

  return data;
}

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toUpperCase()) {
    case 'PAUSED':
      return 'secondary';
    case 'INCALL':
    case '3-WAY':
      return 'default';
    case 'READY':
    case 'CLOSER':
      return 'outline';
    case 'DISPO':
      return 'destructive';
    default:
      return 'secondary';
  }
}

const AgentStatusGrid: React.FC = () => {
  const { data: agents, isLoading, isError, error } = useQuery<AgentStatus[], Error>({
    queryKey: ['agentStatuses'],
    queryFn: fetchAgentStatuses,
    refetchInterval: 5000, // Refetch every 5 seconds
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Real-time Overview</div>
        <p className="text-xs text-muted-foreground">
          Monitor agent activities and statuses. Updates every 5 seconds.
        </p>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Calls Today</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {error?.message || "Could not load agent statuses."}
                      </AlertDescription>
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && agents && agents.length > 0 && (
                agents.map((agent) => (
                  <TableRow key={agent.user}>
                    <TableCell>
                      <div className="font-medium">{agent.full_name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{agent.user} ({agent.user_group})</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(agent.status)}>
                        {agent.status === 'PAUSED' && agent.pause_code ? `${agent.status} (${agent.pause_code})` : agent.status}
                        {agent.sub_status && ` - ${agent.sub_status}`}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.campaign_id}</TableCell>
                    <TableCell className="text-right">{agent.calls_today}</TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && !isError && agents && agents.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No agents are currently logged in.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentStatusGrid;
