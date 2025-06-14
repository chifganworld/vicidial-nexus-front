
import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationPageHeader from '@/components/integrations/IntegrationPageHeader';
import VicidialIntegrationTab from '@/components/integrations/VicidialIntegrationTab';
import SipIntegrationTab from '@/components/integrations/SipIntegrationTab';
import SipTrunksTab from '@/components/integrations/SipTrunksTab';

const IntegrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <Card className="w-full max-w-2xl">
        <IntegrationPageHeader backLink="/settings" />
        <CardContent>
          <Tabs defaultValue="vicidial" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vicidial">Vicidial API</TabsTrigger>
              <TabsTrigger value="sip">SIP Server</TabsTrigger>
              <TabsTrigger value="trunks">SIP Trunks</TabsTrigger>
            </TabsList>
            <TabsContent value="vicidial">
              <VicidialIntegrationTab />
            </TabsContent>
            <TabsContent value="sip">
              <SipIntegrationTab />
            </TabsContent>
            <TabsContent value="trunks">
              <SipTrunksTab />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">
            Changes will take effect immediately for new operations.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IntegrationPage;
