import React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
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
import { AlertCircle, Users, Headphones, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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

  const blindMonitorMutation = useMutation({
    mutationFn: async ({ agent_user, stage }: { agent_user: string, stage: string }) => {
      const { data, error } = await supabase.functions.invoke('blind-monitor-agent', {
        body: { agent_user, stage }
      })
      if (error) {
        try {
            const errorData = await error.context.json();
            throw new Error(errorData?.error || error.message);
        } catch (e) {
            throw new Error(error.message);
        }
      }
      return data
    },
    onSuccess: (data) => {
      toast.success('Monitoring initiated', { description: data.message })
    },
    onError: (error: Error) => {
      toast.error('Monitoring failed', { description: error.message || 'An unknown error occurred.' })
    }
  })

  const handleMonitor = (agentUser: string, stage: 'MONITOR' | 'BARGE') => {
    blindMonitorMutation.mutate({ agent_user: agentUser, stage })
  }

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
                <TableHead>Actions</TableHead>
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
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5}>
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
                    <TableCell>
                      {(agent.status === 'INCALL' || agent.status === '3-WAY') ? (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMonitor(agent.user, 'MONITOR')}
                            disabled={blindMonitorMutation.isPending}
                          >
                            <Headphones className="h-4 w-4 mr-1" /> Monitor
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMonitor(agent.user, 'BARGE')}
                            disabled={blindMonitorMutation.isPending}
                          >
                            <Zap className="h-4 w-4 mr-1" /> Barge
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && !isError && agents && agents.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
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
