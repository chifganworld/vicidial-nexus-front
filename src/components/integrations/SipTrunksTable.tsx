
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SipTrunk } from '@/types/sip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import SipTrunkDialog from './SipTrunkDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SipTrunksTable: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trunks, isLoading } = useQuery({
    queryKey: ['sip_trunks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('sip_trunks').select('*');
      if (error) throw new Error(error.message);
      return data as SipTrunk[];
    },
  });

  const { mutate: deleteTrunk } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sip_trunks').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: 'SIP Trunk deleted successfully.' });
      queryClient.invalidateQueries({ queryKey: ['sip_trunks'] });
    },
    onError: (error) => {
      toast({ title: 'Error deleting trunk', description: error.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ));
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Host</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trunks?.map((trunk) => (
          <TableRow key={trunk.id}>
            <TableCell className="font-medium">{trunk.trunk_name}</TableCell>
            <TableCell>{trunk.host}:{trunk.port}</TableCell>
            <TableCell>
              <Badge variant={trunk.is_active ? 'default' : 'secondary'}>
                {trunk.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <SipTrunkDialog trunk={trunk}>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                  </SipTrunkDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete the "{trunk.trunk_name}" SIP trunk.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTrunk(trunk.id!)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SipTrunksTable;
