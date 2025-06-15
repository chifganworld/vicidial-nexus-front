
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import UsersTab from '@/components/settings/UsersTab';
import GroupsTab from '@/components/settings/GroupsTab';

const UserManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-7xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">User & Group Management</CardTitle>
              <CardDescription>View, add, or manage user accounts, roles, and groups.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/settings">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="py-4">
              <UsersTab />
            </TabsContent>
            <TabsContent value="groups" className="py-4">
              <GroupsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;
