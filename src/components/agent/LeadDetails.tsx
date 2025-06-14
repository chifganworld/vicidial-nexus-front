import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lead } from '@/hooks/useCurrentLead';

interface LeadDetailsProps {
  lead: Lead | null;
  isLoading: boolean;
}

const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-full bg-green-950/20 backdrop-blur-md border-green-400/20 shadow-xl shadow-green-400/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Lead Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!lead) {
    return (
      <Card className="h-full flex items-center justify-center bg-green-950/20 backdrop-blur-md border-green-400/20 shadow-xl shadow-green-400/30">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No active lead.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-green-950/20 backdrop-blur-md border-green-400/20 shadow-xl shadow-green-400/30">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Lead Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="leadName" className="text-xs text-muted-foreground">Name</Label>
          <Input id="leadName" value={lead.name || ''} readOnly className="mt-1 bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="leadPhone" className="text-xs text-muted-foreground">Phone</Label>
          <Input id="leadPhone" value={lead.phone_number} readOnly className="mt-1 bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="leadEmail" className="text-xs text-muted-foreground">Email</Label>
          <Input id="leadEmail" value={lead.email || ''} readOnly className="mt-1 bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="leadStatus" className="text-xs text-muted-foreground">Status</Label>
          <div className="mt-1">
            <Badge variant={lead.status === 'NEW' ? 'default' : 'secondary'}>{lead.status}</Badge>
          </div>
        </div>
        <div>
          <Label htmlFor="leadNotes" className="text-xs text-muted-foreground">Notes</Label>
          <Textarea
            id="leadNotes"
            value={lead.notes || ''}
            readOnly
            className="mt-1 h-24 resize-none bg-gray-50"
            placeholder="No notes available."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadDetails;
