
import React from 'react';
import { useGroups, Group } from '@/hooks/useGroups';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddGroupDialog from '@/components/settings/AddGroupDialog';
import EditGroupDialog from '@/components/settings/EditGroupDialog';
import DeleteGroupDialog from '@/components/settings/DeleteGroupDialog';

const GroupsTab: React.FC = () => {
  const { data: groups, isLoading, isError, error } = useGroups();

  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-80" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ));
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-red-500">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading groups: {error.message}</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    
    if (!groups || groups.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No groups found. Create one to get started.
                </TableCell>
            </TableRow>
        );
    }

    return groups.map((group: Group) => (
      <TableRow key={group.id}>
        <TableCell className="font-medium">{group.name}</TableCell>
        <TableCell>{group.description || 'N/A'}</TableCell>
        <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <EditGroupDialog group={group}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit Group
                </DropdownMenuItem>
              </EditGroupDialog>
              <DeleteGroupDialog groupId={group.id} groupName={group.name}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  Delete Group
                </DropdownMenuItem>
              </DeleteGroupDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
        <div className="flex justify-end mb-4">
            <AddGroupDialog />
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderTableBody()}
            </TableBody>
        </Table>
    </div>
  );
};

export default GroupsTab;
