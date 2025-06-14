
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge'; // Using Badge for status

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  notes: string;
}

// Placeholder lead data
const sampleLead: Lead = {
  id: '12345',
  name: 'John Doe',
  phone: '555-123-4567',
  email: 'john.doe@example.com',
  status: 'New',
  notes: 'Initial contact, interested in Product X. Follow up next week regarding pricing details and a potential demo schedule. Mentioned budget concerns.',
};

const LeadInfoDisplay: React.FC = () => {
  const lead = sampleLead; // In the future, this would come from props or state management

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Lead Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="leadName" className="text-xs text-muted-foreground">Name</Label>
          <Input id="leadName" value={lead.name} readOnly className="mt-1 bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="leadPhone" className="text-xs text-muted-foreground">Phone</Label>
          <Input id="leadPhone" value={lead.phone} readOnly className="mt-1 bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="leadEmail" className="text-xs text-muted-foreground">Email</Label>
          <Input id="leadEmail" value={lead.email} readOnly className="mt-1 bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="leadStatus" className="text-xs text-muted-foreground">Status</Label>
          <div className="mt-1">
            <Badge variant={lead.status === 'New' ? 'default' : 'secondary'}>{lead.status}</Badge>
          </div>
        </div>
        <div>
          <Label htmlFor="leadNotes" className="text-xs text-muted-foreground">Notes</Label>
          <Textarea
            id="leadNotes"
            value={lead.notes}
            readOnly
            className="mt-1 h-24 resize-none bg-gray-50"
            placeholder="No notes available."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadInfoDisplay;

