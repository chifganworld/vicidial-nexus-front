
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type Campaign = {
  campaign_id: string;
  campaign_name: string;
  active: 'Y' | 'N';
  auto_dial_level: string;
  dial_method: string;
  [key: string]: any; // Allow other properties
};

const campaignSettingsSchema = z.object({
  campaign_name: z.string().min(6, 'Must be 6-40 characters').max(40, 'Must be 6-40 characters'),
  active: z.boolean(),
  auto_dial_level: z.coerce.number().min(0).max(18, 'Must be between 0 and 18'),
});

type CampaignSettingsFormData = z.infer<typeof campaignSettingsSchema>;

const fetchCampaigns = async (): Promise<Campaign[]> => {
  const { data, error } = await supabase.functions.invoke('get-campaigns-list');
  if (error) throw error;
  return data.map((d: any) => ({
      ...d,
      auto_dial_level: d.auto_dial_level || '0'
  }));
};

const updateCampaign = async (vars: { campaignId: string, values: CampaignSettingsFormData }) => {
    const { campaignId, values } = vars;
    const { data, error } = await supabase.functions.invoke('update-campaign', {
        body: {
            campaign_id: campaignId,
            campaign_name: values.campaign_name,
            active: values.active ? 'Y' : 'N',
            auto_dial_level: values.auto_dial_level.toString()
        }
    });

    if (error) throw error;
    return data;
}

const CampaignSettingsPage: React.FC = () => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading: isLoadingCampaigns, isError: isCampaignsError, error: campaignsError } = useQuery<Campaign[], Error>({
    queryKey: ['campaignsList'],
    queryFn: fetchCampaigns,
  });

  const form = useForm<CampaignSettingsFormData>({
    resolver: zodResolver(campaignSettingsSchema),
    defaultValues: {
      campaign_name: '',
      active: false,
      auto_dial_level: 0,
    }
  });

  const selectedCampaign = campaigns?.find(c => c.campaign_id === selectedCampaignId);

  useEffect(() => {
    if (selectedCampaign) {
      form.reset({
        campaign_name: selectedCampaign.campaign_name,
        active: selectedCampaign.active === 'Y',
        auto_dial_level: parseFloat(selectedCampaign.auto_dial_level) || 0,
      });
    } else {
      form.reset({
        campaign_name: '',
        active: false,
        auto_dial_level: 0,
      });
    }
  }, [selectedCampaign, form]);

  const mutation = useMutation({
      mutationFn: updateCampaign,
      onSuccess: () => {
          toast.success('Campaign settings updated successfully!');
          queryClient.invalidateQueries({ queryKey: ['campaignsList'] });
      },
      onError: (error) => {
          toast.error(`Failed to update campaign: ${error.message}`);
      }
  });

  const onSubmit = (values: CampaignSettingsFormData) => {
    if (!selectedCampaignId) {
        toast.error("Please select a campaign first.");
        return;
    }
    mutation.mutate({ campaignId: selectedCampaignId, values });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link to="/supervisor"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-3xl font-bold">Campaign Settings</h1>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Modify Campaign</CardTitle>
          <CardDescription>Select a campaign to view and edit its settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select onValueChange={setSelectedCampaignId} value={selectedCampaignId} disabled={isLoadingCampaigns}>
              <SelectTrigger className="w-full md:w-[320px]">
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
            {isCampaignsError && (
             <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error fetching campaigns</AlertTitle>
              <AlertDescription>{campaignsError?.message}</AlertDescription>
            </Alert>
          )}
          </div>

          {!selectedCampaignId && !isLoadingCampaigns && (
            <div className="text-center py-12 text-gray-500">Please select a campaign to see its settings.</div>
          )}
          {isLoadingCampaigns && <Skeleton className="h-48 w-full" />}
          
          {selectedCampaignId && !isLoadingCampaigns && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="campaign_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>Set whether this campaign is active or not.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="auto_dial_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Auto Dial Level</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                         <FormDescription>
                            0 for off. For RATIO dialing, this is the ratio of lines to agents. For ADAPTIVE methods, this is the starting dial level.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={mutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSettingsPage;
