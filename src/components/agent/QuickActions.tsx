
import React from 'react';
import { Button } from '@/components/ui/button';
import AddLeadModal from '@/components/AddLeadModal';
import UpdateLeadModal from '@/components/UpdateLeadModal';
import SearchLeadModal from '@/components/SearchLeadModal';
import ViewCallbacksModal from '@/components/ViewCallbacksModal';
import { Database } from '@/integrations/supabase/types';

type Lead = Database['public']['Tables']['leads']['Row'];

interface QuickActionsProps {
  currentLead: Lead | null;
  onLeadAction: () => void;
  onSetCurrentLead: (lead: Lead) => void;
  onSimulateIncomingCall: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  currentLead,
  onLeadAction,
  onSetCurrentLead,
  onSimulateIncomingCall,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <AddLeadModal onLeadAdded={onLeadAction} />
        <UpdateLeadModal lead={currentLead} onLeadUpdated={onLeadAction} />
        <SearchLeadModal onLeadSelect={onSetCurrentLead} />
        <ViewCallbacksModal />
        <Button variant="secondary" className="w-full" onClick={onSimulateIncomingCall}>
          Simulate Incoming Call
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
