
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddUserDialog from '@/components/settings/AddUserDialog';
import EditUserDialog from '@/components/settings/EditUserDialog';
import DeleteUserDialog from '@/components/settings/DeleteUserDialog';
import { User } from '@/types/user';

const fetchUsers = async () => {
  const { data, error } = await supabase.rpc('get_users_for_management');
  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }
  return data as User[];
};

const UsersTab: React.FC = () => {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['usersForManagement'],
    queryFn: fetchUsers,
  });

  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-52" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ));
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center text-red-500">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error loading users: {error.message}</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    
    if (!users || users.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No users found.
                </TableCell>
            </TableRow>
        );
    }

    return users.map((user) => (
      <TableRow key={user.id}>
        <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => <Badge key={role} variant="secondary">{role}</Badge>)
            ) : (
                <Badge variant="outline">No Role</Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
            <div className="flex flex-wrap gap-1">
                {user.groups && user.groups.length > 0 ? (
                    user.groups.map((group) => <Badge key={group} variant="outline">{group}</Badge>)
                ) : (
                    <span className="text-xs text-muted-foreground">No Groups</span>
                )}
            </div>
        </TableCell>
        <TableCell>{user.sip_number || 'N/A'}</TableCell>
        <TableCell>{user.webrtc_number || 'N/A'}</TableCell>
        <TableCell className="font-mono">{user.sip_password ? '********' : 'N/A'}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <EditUserDialog user={user}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit User
                </DropdownMenuItem>
              </EditUserDialog>
              <DeleteUserDialog userId={user.id} userName={user.full_name || user.email || 'this user'}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  Delete User
                </DropdownMenuItem>
              </DeleteUserDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };
  
  return (
    <div>
        <div className="flex justify-end mb-4">
            <AddUserDialog />
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Groups</TableHead>
                <TableHead>SIP Number</TableHead>
                <TableHead>WebRTC Number</TableHead>
                <TableHead>SIP Password</TableHead>
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

export default UsersTab;
