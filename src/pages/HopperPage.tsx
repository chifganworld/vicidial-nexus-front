import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';

type Campaign = {
  campaign_id: string;
  campaign_name: string;
};

type HopperLead = {
  [key: string]: string;
};

const fetchCampaigns = async (): Promise<Campaign[]> => {
  const { data, error } = await supabase.functions.invoke('get-campaigns-list');
  if (error) throw error;
  return data;
};

const fetchHopperList = async (campaignId: string): Promise<HopperLead[]> => {
  const { data, error } = await supabase.functions.invoke('get-hopper-list', {
    body: { campaign_id: campaignId },
  });
  if (error) throw error;
  return data;
};

const HopperPage: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  const { data: campaigns, isLoading: isLoadingCampaigns, isError: isCampaignsError, error: campaignsError } = useQuery<Campaign[], Error>({
    queryKey: ['campaignsList'],
    queryFn: fetchCampaigns,
  });

  const { data: hopper, isLoading: isLoadingHopper, isError: isHopperError, error: hopperError, refetch } = useQuery<HopperLead[], Error>({
    queryKey: ['hopperList', selectedCampaign],
    queryFn: () => fetchHopperList(selectedCampaign),
    enabled: !!selectedCampaign,
  });
  
  const hopperTableHeaders = hopper && hopper.length > 0 ? Object.keys(hopper[0]) : [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link to="/supervisor"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-3xl font-bold">Campaign Hopper</h1>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>View Hopper Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select onValueChange={setSelectedCampaign} value={selectedCampaign} disabled={isLoadingCampaigns}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder={isLoadingCampaigns ? "Loading campaigns..." : "Select a campaign..."} />
              </SelectTrigger>
              <SelectContent>
                {campaigns?.map((campaign) => (
                  <SelectItem key={campaign.campaign_id} value={campaign.campaign_id}>
                    {campaign.campaign_name} ({campaign.campaign_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Button onClick={() => refetch()} disabled={!selectedCampaign || isLoadingHopper}>
              Refresh
            </Button>
          </div>
          
          {isCampaignsError && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error fetching campaigns</AlertTitle>
              <AlertDescription>{campaignsError?.message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {hopperTableHeaders.map(header => <TableHead key={header}>{header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedCampaign ? (
                  <TableRow>
                    <TableCell colSpan={hopperTableHeaders.length || 5} className="text-center py-8">
                      {isLoadingCampaigns ? 'Loading campaigns...' : 'Please select a campaign to view the hopper.'}
                    </TableCell>
                  </TableRow>
                ) : isLoadingHopper ? (
                  <TableRow>
                    <TableCell colSpan={hopperTableHeaders.length || 5}>
                      <Skeleton className="h-20 w-full" />
                    </TableCell>
                  </TableRow>
                ) : isHopperError ? (
                  <TableRow>
                    <TableCell colSpan={hopperTableHeaders.length || 5}>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error fetching hopper</AlertTitle>
                        <AlertDescription>{hopperError?.message}</AlertDescription>
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : hopper && hopper.length > 0 ? (
                  hopper.map((lead, index) => (
                    <TableRow key={index}>
                      {hopperTableHeaders.map(header => <TableCell key={header}>{lead[header]}</TableCell>)}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={hopperTableHeaders.length || 5} className="text-center py-8">
                      No leads in the hopper for this campaign.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HopperPage;
