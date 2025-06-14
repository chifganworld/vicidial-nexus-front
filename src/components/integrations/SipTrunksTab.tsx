
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SipTrunksTable from './SipTrunksTable';
import SipTrunkDialog from './SipTrunkDialog';

const SipTrunksTab: React.FC = () => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>SIP Trunks</CardTitle>
            <CardDescription>Manage your SIP trunk configurations for making and receiving calls.</CardDescription>
          </div>
          <SipTrunkDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Trunk
            </Button>
          </SipTrunkDialog>
        </div>
      </CardHeader>
      <CardContent>
        <SipTrunksTable />
      </CardContent>
    </Card>
  );
};

export default SipTrunksTab;
